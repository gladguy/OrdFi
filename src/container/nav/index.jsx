import { useWallets } from "@wallet-standard/react";
import {
  Col,
  Divider,
  Drawer,
  Flex,
  Grid,
  Menu,
  Row,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import { PiCopyBold } from "react-icons/pi";
import { RiWallet3Fill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { AddressPurpose, BitcoinNetworkType, getAddress } from "sats-connect";
import Web3 from "web3";
import ordinals_O_logo from "../../assets/brands/ordinals_O_logo.png";
import Bitcoin from "../../assets/coin_logo/Bitcoin.png";
import logo from "../../assets/coin_logo/bnb_coin.png";
import myordinalslogo from "../../assets/logo/ordinalslogo.png";
import CustomButton from "../../component/Button";
import CardDisplay from "../../component/card";
import ModalDisplay from "../../component/modal";
import Notify from "../../component/notification";
import { setLoading } from "../../redux/slice/constant";
import {
  clearWalletState,
  setMagicEdenCredentials,
  setMetaCredentials,
  setUnisatCredentials,
  setXverseCredentials,
} from "../../redux/slice/wallet";
import { storageIdlFactory } from "../../storage_canister";
import {
  agentCreator,
  API_METHODS,
  apiUrl,
  BTCWallets,
  chainId,
  IndexContractAddress,
  MAGICEDEN_WALLET_KEY,
  META_WALLET_KEY,
  paymentWallets,
  sliceAddress,
  storage,
  UNISAT_WALLET_KEY,
  XVERSE_WALLET_KEY,
} from "../../utils/common";
import indexJson from "../../utils/index_abi.json";
import { propsContainer } from "../props-container";
import { ethers } from "ethers";

const Nav = (props) => {
  const { Text } = Typography;
  const { useBreakpoint } = Grid;
  const breakPoint = useBreakpoint();
  const { wallets } = useWallets();

  const { location, navigate } = props.router;
  const { dispatch, reduxState } = props.redux;

  const walletState = reduxState.wallet;
  const activeWallet = reduxState.wallet.active;
  const metaAddress = walletState.meta.address;
  const xverseAddress = walletState.xverse.ordinals.address;
  const unisatAddress = walletState.unisat.address;
  const magicEdenAddress = walletState.magicEden.ordinals.address;

  const [isConnectModal, setConnectModal] = useState(false);
  const [tabKey, setTabKey] = useState("1");
  const [open, setOpen] = useState(false);
  const [screenDimensions, setScreenDimensions] = React.useState({
    width: window.screen.width,
    height: window.screen.height,
  });
  const [current, setCurrent] = useState();
  const [activeConnections, setActiveConnections] = useState([]);
  const [activeAddresses, setActiveAddresses] = useState({});
  const [walletConnection, setWalletConnection] = useState({});

  const avatar = process.env.REACT_APP_AVATAR;
  const SatsConnectNamespace = "sats-connect:";

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrent("tmp-0");
    } else if (location.pathname === "/borrow") {
      setCurrent("tmp-1");
    } else if (location.pathname === "/lend") {
      setCurrent("tmp-2");
    }
    if (location.pathname === "/portfolio") {
      setCurrent("tmp-3");
    }
  }, [current, location.pathname]);

  const errorMessageNotify = (message) => {
    Notify("error", message);
  };

  const successMessageNotify = (message) => {
    Notify("success", message);
  };

  const collapseConnectedModal = () => {
    setConnectModal(!isConnectModal);
    setOpen(false);
  };

  function isSatsConnectCompatibleWallet(wallet) {
    return SatsConnectNamespace in wallet.features;
  }

  const connectWallet = async (walletName) => {
    if (walletName === XVERSE_WALLET_KEY) {
      const getAddressOptions = {
        payload: {
          purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
          message: "Address for receiving Ordinals and payments",
          network: {
            type: BitcoinNetworkType.Mainnet,
          },
        },
        onFinish: async (response) => {
          if (response.addresses) {
            const { addresses } = response;
            const ordinals = addresses.find(
              (ele) => ele.purpose === AddressPurpose.Ordinals
            );
            const payment = addresses.find(
              (ele) => ele.purpose === AddressPurpose.Payment
            );
            // dispatch(setXversePayment(payment));
            // dispatch(setXverseOrdinals(ordinals));

            const result = await API_METHODS.get(
              `${apiUrl.Unisat_open_api}/v1/indexer/address/${payment.address}/balance`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.REACT_APP_UNISAT_BEARER}`,
                },
              }
            );

            const xverseBtc =
              result.data.data.satoshi / process.env.REACT_APP_BTC_ZERO;
            setWalletConnection({
              ...walletConnection,
              [XVERSE_WALLET_KEY]: {
                ordinals: ordinals,
                payment: payment,
                btcBalance: xverseBtc,
              },
            });
            setActiveConnections([...activeConnections, XVERSE_WALLET_KEY]);
            setActiveAddresses({
              ...activeAddresses,
              [XVERSE_WALLET_KEY]: ordinals.address,
            });
            successMessageNotify("x-verse Wallet connected!");
          }
        },
        onCancel: () => errorMessageNotify("User rejected the request."),
      };
      try {
        await getAddress(getAddressOptions);
      } catch (error) {
        errorMessageNotify(error.message);
      }
    } else if (walletName === UNISAT_WALLET_KEY) {
      // UNISAT
      if (typeof window.unisat !== "undefined") {
        try {
          dispatch(setLoading(true));
          var accounts = await window.unisat.requestAccounts();
          let publicKey = await window.unisat.getPublicKey();
          let { confirmed: BtcBalance } = await window.unisat.getBalance();
          dispatch(setLoading(false));
          setWalletConnection({
            ...walletConnection,
            [UNISAT_WALLET_KEY]: {
              address: accounts[0],
              publicKey,
              btcBalance: BtcBalance / process.env.REACT_APP_BTC_ZERO,
            },
          });
          setActiveConnections([...activeConnections, UNISAT_WALLET_KEY]);
          setActiveAddresses({
            ...activeAddresses,
            [UNISAT_WALLET_KEY]: accounts[0],
          });
          successMessageNotify("Unisat Wallet connected!");
        } catch (error) {
          dispatch(setLoading(false));
          errorMessageNotify(error.message);
        }
      } else {
        errorMessageNotify("No unisat wallet installed!");
      }
    } else if (walletName === MAGICEDEN_WALLET_KEY) {
      try {
        const provider = wallets.find(isSatsConnectCompatibleWallet);
        await getAddress({
          getProvider: async () =>
            provider.features[SatsConnectNamespace]?.provider,
          payload: {
            purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
            message: "Address for receiving Ordinals and payments",
            network: {
              type: BitcoinNetworkType.Mainnet,
            },
          },
          onFinish: async (response) => {
            const { addresses } = response;
            const ordinals = addresses.find(
              (ele) => ele.purpose === AddressPurpose.Ordinals
            );
            const payment = addresses.find(
              (ele) => ele.purpose === AddressPurpose.Payment
            );

            const result = await API_METHODS.get(
              `${apiUrl.Unisat_open_api}/v1/indexer/address/${payment.address}/balance`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.REACT_APP_UNISAT_BEARER}`,
                },
              }
            );

            const magicEdenBtc =
              result.data.data.satoshi / process.env.REACT_APP_BTC_ZERO;
            setWalletConnection({
              ...walletConnection,
              [MAGICEDEN_WALLET_KEY]: {
                ordinals,
                payment,
                btcBalance: magicEdenBtc,
              },
            });
            setActiveConnections([...activeConnections, MAGICEDEN_WALLET_KEY]);
            setActiveAddresses({
              ...activeAddresses,
              [MAGICEDEN_WALLET_KEY]: ordinals.address,
            });
            successMessageNotify("Magiceden Wallet connected!");
          },
          onCancel: () => {
            // alert("Request canceled");
          },
        });
      } catch (err) {
        console.log("magiceden error", err);
      }
    } else {
      // Meta wallet
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();

          if (Number(networkId) !== 97) {
            Notify("error", "Switch to the tBNB network!");
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId }],
              });
            } catch (switchError) {
              if (switchError.code === 4902) {
                // This error code indicates that the chain has not been added to MetaMask.
                try {
                  await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId,
                        chainName: "Binance Smart Chain Testnet",
                        rpcUrls: [
                          "https://data-seed-prebsc-1-s1.binance.org:8545/",
                        ],
                        blockExplorerUrls: ["https://testnet.bscscan.com"],
                        nativeCurrency: {
                          name: "Binance Coin",
                          symbol: "BNB",
                          decimals: 18,
                        },
                      },
                    ],
                  });
                } catch (addError) {
                  console.error("Failed to add the network:", addError);
                }
              } else {
                console.error("Failed to switch the network:", switchError);
              }
            }
            return;
          }
          Notify("success", "Metamask wallet connected!");
          setWalletConnection({
            ...walletConnection,
            [META_WALLET_KEY]: {
              address: accounts[0],
              publicKey: null,
            },
          });
          setActiveConnections([...activeConnections, META_WALLET_KEY]);
          setActiveAddresses({
            ...activeAddresses,
            [META_WALLET_KEY]: accounts[0],
          });
        } catch (error) {
          console.error("User denied account access", error);
        }
      } else if (window.web3) {
        // Legacy dapp browsers...
        // const web3 = new Web3(window.web3.currentProvider);
      } else {
        Notify(
          "warning",
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }
  };

  const storeWallets = (wallet) => {
    if (META_WALLET_KEY === wallet) {
      dispatch(setMetaCredentials(walletConnection[META_WALLET_KEY]));
    } else if (XVERSE_WALLET_KEY === wallet) {
      dispatch(setXverseCredentials(walletConnection[XVERSE_WALLET_KEY]));
    } else if (UNISAT_WALLET_KEY === wallet) {
      dispatch(setUnisatCredentials(walletConnection[UNISAT_WALLET_KEY]));
    } else {
      dispatch(setMagicEdenCredentials(walletConnection[MAGICEDEN_WALLET_KEY]));
    }
  };

  const handleConnectionFinish = async () => {
    collapseConnectedModal();
    try {
      dispatch(setLoading(true));
      let isConnectionExist = false;
      const API = agentCreator(storageIdlFactory, storage);
      const btcAddress = walletConnection?.xverse
        ? walletConnection.xverse.ordinals.address
        : walletConnection?.magiceden
        ? walletConnection.magiceden.ordinals.address
        : walletConnection?.unisat?.address;
      const metaAddress = walletConnection.meta.address;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        IndexContractAddress,
        indexJson,
        signer
      );
      const isAcExist = await contract.getBitcoinAddressId(metaAddress);
      const isAccountExistInABI = Number(isAcExist.toString());

      let verifyAddress = await API.verifyAddressPair({
        chain_id: chainId,
        bitcoinAddress: btcAddress,
        ethereumAddress: metaAddress,
      });
      verifyAddress = Number(verifyAddress);

      if (verifyAddress === 0 && isAccountExistInABI) {
        isConnectionExist = true;
      } else if (verifyAddress === 1) {
        const btcAddress = await API.getByEthereumAddress({
          chainId: chainId,
          ethereumAddress: metaAddress,
        });
        Notify(
          "warning",
          `Account not found, try connecting ${btcAddress} BTC account!`
        );
      } else if (verifyAddress === 2) {
        const ethAddress = await API.getByBitcoinAddress({
          chainId: chainId,
          bitcoinAddress: btcAddress,
        });
        Notify(
          "warning",
          `Account not found, try connecting ${ethAddress} ETH account!`
        );
      } else if (verifyAddress === 3) {
        const storeAddress = await API.storeAddress({
          chain_id: chainId,
          bitcoinAddress: btcAddress,
          ethereumAddress: metaAddress,
        });

        if (!isAccountExistInABI) {
          const saveResult = await contract.saveBitcoinAddress(
            Number(storeAddress),
            metaAddress
          );
          await saveResult.wait();
          if (saveResult.hash) {
            Notify("success", "Account creation success!", 3000);
          }
        }
        isConnectionExist = true;
      }

      if (isConnectionExist) {
        activeConnections.forEach((wallet) => {
          storeWallets(wallet);
        });
        Notify("success", "Wallet connection success!");
        collapseConnectedModal();
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      setWalletConnection({});
      setActiveConnections([]);
      console.log("finish connection error", error);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const isDisabled = (key) => {
    const connected = activeConnections.includes(key);
    if (connected) return "card-disabled";
    const cond = (bool) => (bool ? "card-disabled" : "");
    switch (key) {
      case XVERSE_WALLET_KEY: {
        return cond(
          activeConnections.includes(UNISAT_WALLET_KEY) ||
            activeConnections.includes(MAGICEDEN_WALLET_KEY)
        );
      }
      case UNISAT_WALLET_KEY: {
        return cond(
          activeConnections.includes(XVERSE_WALLET_KEY) ||
            activeConnections.includes(MAGICEDEN_WALLET_KEY)
        );
      }
      case MAGICEDEN_WALLET_KEY: {
        return cond(
          activeConnections.includes(XVERSE_WALLET_KEY) ||
            activeConnections.includes(UNISAT_WALLET_KEY)
        );
      }
      default:
        return "";
    }
  };

  const walletCards = (wallet, index) => (
    <CardDisplay
      key={`${wallet.label}-${index + 1 * 123}`}
      className={`modalCardBg card-hover width pointer grey-bg m-top-bottom ${isDisabled(
        wallet.key
      )}`}
      hoverable={true}
      onClick={() => {
        connectWallet(wallet.key);
      }}
    >
      <Row align={"middle"}>
        <img
          src={wallet.image}
          alt={`${wallet.key}_logo`}
          style={{
            marginRight: wallet.key === "xverse" ? "20px" : "10px",
          }}
          width={wallet.key === "xverse" ? "7%" : "10%"}
        />{" "}
        <h2
          style={{ margin: "0" }}
          className="white-color font-courier font-large letter-spacing-medium"
          level={2}
        >
          {wallet.label}
        </h2>
      </Row>
    </CardDisplay>
  );

  const getScreenDimensions = (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setScreenDimensions({ width, height });
  };

  useEffect(() => {
    window.addEventListener("resize", getScreenDimensions);
    return () => {
      window.removeEventListener("resize", getScreenDimensions);
    };
  }, []);

  const onClick = (e) => {
    setCurrent(e.key);
  };

  const options = [
    getItem(<Row className="font-style">Browse</Row>),
    getItem(<Row className="font-style">Lending</Row>),
    getItem(<Row className="font-style">Borrowing</Row>),
    getItem(<Row className="font-style ">Bridge Ordinals</Row>),
    getItem(<Row className="font-style">Portfolio</Row>),
  ];

  const addressRendererWithCopy = (address) => {
    return (
      <Tooltip arrow title={"Copied"} trigger={"click"} placement="top">
        <PiCopyBold
          className="pointer"
          onClick={() => {
            navigator.clipboard.writeText(address);
          }}
          size={15}
        />
      </Tooltip>
    );
  };

  const avatarRenderer = (width) => (
    <img
      src={`${avatar}/svg?seed=${
        xverseAddress
          ? xverseAddress
          : unisatAddress
          ? unisatAddress
          : magicEdenAddress
          ? magicEdenAddress
          : metaAddress
      }`}
      width={width}
      className="avatar"
      alt="avatar"
    />
  );
  gsap.to(".round", {
    rotation: 360,
    duration: 4,
    repeat: -1,
    repeatDelay: 10,
    ease: "none",
  });

  return (
    <>
      <Row
        justify={{
          xs: "space-between",
          lg: "space-between",
          xl: "space-between",
        }}
        align={"middle"}
        className="mt-2"
      >
        <Col>
          <Row align={"middle"}>
            <Col>
              <img
                src={myordinalslogo}
                alt="logo"
                className="pointer"
                width={100}
                onClick={() => {
                  // navigate("/");
                }}
              />
            </Col>
          </Row>
        </Col>

        <Col>
          {screenDimensions.width >= 1200 && (
            <>
              <Flex gap={50}>
                <Text
                  className={`${
                    location.pathname === "/"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Browse
                </Text>
                <Text className="font-xsmall color-grey">|</Text>
                <Text
                  className={`${
                    location.pathname === "/lending"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/lending");
                  }}
                >
                  Lending
                </Text>
                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${
                    location.pathname === "/borrowing"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/borrowing");
                  }}
                >
                  Borrowing
                </Text>

                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${
                    location.pathname === "/bridge"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => navigate("/bridge")}
                >
                  Bridge Ordinals
                </Text>
                <Text className="font-xsmall color-grey">|</Text>
                <Text
                  className={`${
                    location.pathname.includes("portfolio")
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one  `}
                  onClick={() => {
                    navigate("/portfolio");
                  }}
                >
                  Portfolio
                </Text>

                <Text className="font-xsmall color-grey">|</Text>

                <Text
                  className={`${
                    location.pathname === "/activeloans"
                      ? "headertitle headerStyle"
                      : "font-style headerCompanyName"
                  } pointer heading-one `}
                  onClick={() => {
                    navigate("/activeloans");
                  }}
                >
                  Active Loans
                </Text>
              </Flex>
            </>
          )}
        </Col>

        <Col>
          <Flex gap={10} justify="end" align={"center"}>
            {activeWallet.length ? (
              <Col>
                <Flex
                  gap={5}
                  align="center"
                  className="pointer"
                  onClick={showDrawer}
                  justify="space-evenly"
                >
                  {screenDimensions.width > 767 ? (
                    <>{avatarRenderer(45)}</>
                  ) : (
                    <label class="hamburger">
                      <input type="checkbox" checked={open} />
                      <svg viewBox="0 0 32 32">
                        <path
                          class="line line-top-bottom"
                          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                        ></path>
                        <path class="line" d="M7 16 27 16"></path>
                      </svg>
                    </label>
                  )}
                </Flex>
              </Col>
            ) : (
              <Col>
                {!breakPoint.xs ? (
                  <Row justify={"end"}>
                    <CustomButton
                      className="click-btn font-weight-600 letter-spacing-small"
                      // old btn style
                      // className="button-css lend-button"
                      title={"Connect"}
                      onClick={() => {
                        if (walletState.active.length < 2) {
                          collapseConnectedModal();
                        } else {
                          successMessageNotify("Wallet already connected!");
                        }
                      }}
                    />
                  </Row>
                ) : (
                  <RxHamburgerMenu
                    color="violet"
                    size={25}
                    onClick={showDrawer}
                  />
                )}
              </Col>
            )}
          </Flex>
        </Col>
      </Row>

      <ModalDisplay
        open={isConnectModal}
        footer={""}
        onCancel={() => {
          collapseConnectedModal();
          setWalletConnection({});
          setActiveConnections([]);
        }}
        destroyOnClose={true}
        width={breakPoint.xs ? "100%" : "32%"}
      >
        <Row justify={"start"} align={"middle"}>
          <Text
            className={`${
              breakPoint.xs ? "font-medium" : "font-large"
            } gradient-text-one biticon heading-one`}
          >
            <RiWallet3Fill
              color="#55AD9B"
              size={breakPoint.xs ? 27 : 35}
              className="border-radius-5"
            />{" "}
            Connect Wallet{" "}
          </Text>
        </Row>

        <Row justify={"start"} align={"middle"}>
          <Text className={`font-small text-color-two biticon mt-15`}>
            Connect the Meta wallet for payments and connect any one BTC wallet
            for lending and borrowing.
          </Text>
        </Row>

        <Row justify={"start"} align={"middle"}>
          <Text className={`font-small text-color-two biticon mt-15`}>
            Note: Connect one wallet from each category.
          </Text>
        </Row>

        <Row justify={"center"}>
          <Divider />
        </Row>

        {Object.entries(activeAddresses).map((wallet) => {
          const [walletName, address] = wallet;
          return (
            <Row>
              <Flex gap={15}>
                <Text className="text-color-one font-medium">
                  {walletName === "meta" ? "Payment" : "Ordinals"} {"-->"}
                </Text>
                <Text className="text-color-four font-small">
                  {sliceAddress(address, 9)} {addressRendererWithCopy(address)}
                </Text>
              </Flex>
            </Row>
          );
        })}

        <Row>
          <Col xs={24}>
            <Tabs
              activeKey={tabKey}
              onChange={(e) => {
                e !== "3" && setTabKey(e);
              }}
              items={[
                {
                  key: "1",
                  label: (
                    <Row align={"middle"}>
                      <img
                        src={logo}
                        alt="noimage"
                        style={{ paddingRight: "10px" }}
                        width={25}
                      />
                      <Text className="font-weight-600 letter-spacing-medium text-color-one font-large">
                        {" "}
                        BNB
                      </Text>
                    </Row>
                  ),
                  children: (
                    <>
                      {paymentWallets.map((wallet, index) => {
                        return (
                          <Row key={`index-${wallet.key}`}>
                            {walletCards(wallet, index)}
                          </Row>
                        );
                      })}
                    </>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <Row align={"middle"}>
                      <img
                        src={Bitcoin}
                        alt="noimage"
                        style={{ paddingRight: "10px" }}
                        width={25}
                      />
                      <Text className="font-weight-600 letter-spacing-medium text-color-one font-large">
                        {" "}
                        BTC
                      </Text>
                    </Row>
                  ),
                  children: (
                    <>
                      {BTCWallets.map((wallet, index) => {
                        return (
                          <Row key={`index-${wallet.key}`}>
                            {walletCards(wallet, index)}
                          </Row>
                        );
                      })}
                    </>
                  ),
                },
                {
                  key: "3",
                  label: (
                    <>
                      {activeConnections.length === 2 ? (
                        <Row align={"middle"}>
                          <CustomButton
                            block
                            title={"Sign in"}
                            onClick={handleConnectionFinish}
                            className={
                              "click-btn font-weight-600 letter-spacing-small"
                            }
                          />
                        </Row>
                      ) : (
                        ""
                      )}
                    </>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </ModalDisplay>

      <Drawer
        closeIcon
        width={screenDimensions.width > 425 ? "320px" : "280px"}
        style={{ height: screenDimensions.width > 1199 ? "43%" : "100%" }}
        title={
          <>
            <Row justify={"space-evenly"} align={"middle"}>
              <Flex gap={10} align="center">
                {avatarRenderer(45)}
                <Text className="text-color-one">
                  {xverseAddress ? (
                    <>{sliceAddress(xverseAddress, 5)}</>
                  ) : unisatAddress ? (
                    <>{sliceAddress(unisatAddress, 5)}</>
                  ) : magicEdenAddress ? (
                    <>{sliceAddress(magicEdenAddress, 5)}</>
                  ) : (
                    <>{sliceAddress(metaAddress, 5)}</>
                  )}
                </Text>
              </Flex>
            </Row>
            <Row justify={"center"}>
              <Divider />
            </Row>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        footer={
          <>
            {screenDimensions.width > 1199 && (
              <Row justify={"end"} className="iconalignment pointer">
                <CustomButton
                  className={"click-btn font-weight-600 letter-spacing-small"}
                  onClick={async () => {
                    successMessageNotify("Your are signed out!");
                    dispatch(clearWalletState());
                    setWalletConnection({});
                    setActiveConnections([]);
                    onClose();
                  }}
                  title={
                    <Flex align="center" justify="center" gap={3}>
                      <AiOutlineDisconnect
                        color="white"
                        style={{ fill: "chocolate" }}
                        size={25}
                      />
                      <Text className="text-color-one font-small heading-one">
                        Disconnect
                      </Text>
                    </Flex>
                  }
                  block
                  size="medium"
                />
              </Row>
            )}
          </>
        }
      >
        {/* Drawer Renderer */}
        <>
          <Row justify={"space-between"} align={"middle"}>
            <Col>
              <Flex align="center">
                <img
                  src={logo}
                  alt="bnb"
                  style={{ marginRight: "20px" }}
                  width={25}
                />
                <Flex vertical>
                  <Text className="text-color-two font-medium">Payments</Text>
                  <Text className="text-color-one font-xsmall">
                    {metaAddress ? (
                      <>
                        {sliceAddress(metaAddress, 9)}{" "}
                        {addressRendererWithCopy(metaAddress)}
                      </>
                    ) : (
                      "---"
                    )}
                  </Text>
                </Flex>
              </Flex>
            </Col>

            <Col>
              {walletState.active.includes(META_WALLET_KEY) ? null : (
                <CustomButton
                  className="font-size-18 black-bg text-color-one border-none"
                  title={"Connect"}
                  onClick={() => {
                    if (walletState.active.length < 2) {
                      collapseConnectedModal();
                    } else {
                      successMessageNotify("Wallet already connected!");
                    }
                  }}
                />
              )}
            </Col>
          </Row>

          <Row justify={"space-between"} className="mt" align={"middle"}>
            <Col>
              <Flex align="center">
                <img
                  src={ordinals_O_logo}
                  alt="bitcoin"
                  style={{ marginRight: "20px", borderRadius: "50%" }}
                  width={25}
                />
                <Flex vertical>
                  <Text className="text-color-two font-medium">Ordinals</Text>
                  <Text className="text-color-one font-xsmall">
                    {xverseAddress ? (
                      <>
                        {sliceAddress(xverseAddress, 9)}{" "}
                        {addressRendererWithCopy(xverseAddress)}
                      </>
                    ) : unisatAddress ? (
                      <>
                        {sliceAddress(unisatAddress, 9)}{" "}
                        {addressRendererWithCopy(unisatAddress)}
                      </>
                    ) : magicEdenAddress ? (
                      <>
                        {sliceAddress(magicEdenAddress, 9)}{" "}
                        {addressRendererWithCopy(magicEdenAddress)}
                      </>
                    ) : (
                      "---"
                    )}
                  </Text>
                </Flex>
              </Flex>
            </Col>

            {/* <Col>
              <CustomButton
                className="font-size-18 black-bg text-color-one border-none"
                title={"Connect"}
                onClick={() => {
                  handleTransfer();
                }}
              />
            </Col> */}

            <Col>
              {walletState.active.includes(XVERSE_WALLET_KEY) ||
              walletState.active.includes(UNISAT_WALLET_KEY) ||
              walletState.active.includes(MAGICEDEN_WALLET_KEY) ? null : (
                <CustomButton
                  className="font-size-18 black-bg text-color-one border-none"
                  title={"Connect"}
                  onClick={() => {
                    if (walletState.active.length < 2) {
                      collapseConnectedModal();
                    } else {
                      successMessageNotify("Wallet already connected!");
                    }
                  }}
                />
              )}
            </Col>
          </Row>

          {screenDimensions.width < 1200 && (
            <>
              <Row
                style={{ marginTop: "10px" }}
                justify={{
                  xs: "center",
                  sm: "center",
                  md: "end",
                  lg: "end",
                  xl: "end",
                }}
                className="iconalignment pointer"
              >
                <CustomButton
                  className={"click-btn font-weight-600 letter-spacing-small"}
                  onClick={async () => {
                    successMessageNotify("Your are signed out!");
                    dispatch(clearWalletState());
                    setWalletConnection({});
                    setActiveConnections([]);
                    onClose();
                  }}
                  title={
                    <>
                      <AiOutlineDisconnect
                        color="white"
                        style={{ fill: "chocolate" }}
                        size={25}
                      />
                      <Text className="text-color-two font-small heading-one">
                        Disconnect
                      </Text>
                    </>
                  }
                  block
                  size="medium"
                />
              </Row>
              <Row justify={"center"}>
                <Divider />
              </Row>
              <Menu
                onClick={onClick}
                style={{ width: screenDimensions.width > 425 ? 270 : 230 }}
                defaultOpenKeys={["sub1"]}
                selectedKeys={[current]}
                mode="inline"
                items={options}
              />
              {/* {screenDimensions.width < 992 && (
                <Row style={{ padding: " 0px 24px", marginTop: "10px" }}>
                  <Col>
                    <Loading
                      spin={!constantState.btcvalue}
                      indicator={
                        <TailSpin
                          stroke="#6a85f1"
                          alignmentBaseline="central"
                        />
                      }
                    >
                      {constantState.btcvalue ? (
                        <Flex gap={5}>
                          <Text className="gradient-text-one font-small heading-one">
                            BTC
                          </Text>
                          <img
                            src={Bitcoin}
                            alt="noimage"
                            style={{ justifyContent: "center" }}
                            width="35dvw"
                          />{" "}
                          <Text className="gradient-text-one font-small heading-one">
                            $ {constantState.btcvalue}
                          </Text>
                        </Flex>
                      ) : (
                        ""
                      )}
                    </Loading>
                  </Col>
                </Row>
              )} */}
            </>
          )}
        </>
        {/* Drawer renderer ended */}
      </Drawer>
    </>
  );
};

export default propsContainer(Nav);
