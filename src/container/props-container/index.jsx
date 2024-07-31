import { Actor, HttpAgent } from "@dfinity/agent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Notify from "../../component/notification";
import { apiFactory } from "../../ordinal_canister";
import {
  setAgent,
  setApprovedCollection,
  setBnbValue,
  setBtcValue,
  setCollection,
} from "../../redux/slice/constant";
import {
  API_METHODS,
  apiUrl,
  calculateAPY,
  ordinals,
} from "../../utils/common";

export const propsContainer = (Component) => {
  function ComponentWithRouterProp(props) {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const reduxState = useSelector((state) => state);

    const activeWallet = reduxState.wallet.active;
    const api_agent = reduxState.constant.agent;
    const bnbValue = reduxState.constant.bnbValue;

    const [isEthConnected, setIsEthConnected] = useState(false);

    useEffect(() => {
      if (activeWallet.length) {
        (async () => {
          try {
            const isConnected = await window.ethereum.isConnected();
            setIsEthConnected(isConnected);
          } catch (error) {
            console.log("error eth isConnected", error);
          }
        })();
      }
    }, [activeWallet.length]);

    const btcPrice = async () => {
      const BtcData = await API_METHODS.get(
        `${apiUrl.Asset_server_base_url}/api/v1/fetch/BtcPrice`
      );
      return BtcData;
    };

    const fetchBTCLiveValue = async () => {
      try {
        const BtcData = await btcPrice();
        if (BtcData.data.data[0]?.length) {
          const btcValue = BtcData.data.data[0].flat();
          dispatch(setBtcValue(btcValue[1]));
        } else {
          fetchBTCLiveValue();
        }
      } catch (error) {
        // Notify("error", "Failed to fetch ckBtc");
      }
    };

    useEffect(() => {
      (async () => {
        try {
          if (!api_agent) {
            const ordinalAgent = new HttpAgent({
              host: process.env.REACT_APP_HTTP_AGENT_ACTOR_HOST,
            });

            const agent = Actor.createActor(apiFactory, {
              agent: ordinalAgent,
              canisterId: ordinals,
            });

            dispatch(setAgent(agent));
          }
        } catch (error) {
          Notify("error", error.message);
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
      (() => {
        setInterval(async () => {
          fetchBTCLiveValue();
        }, [300000]);
        return () => clearInterval();
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_agent, dispatch]);

    useEffect(() => {
      (async () => {
        if (api_agent) {
          const result = await api_agent.get_collections();
          const approvedCollections = await api_agent.getApproved_Collections();
          const collections = JSON.parse(result);
          if (approvedCollections.length) {
            const collectionPromise = approvedCollections.map(async (asset) => {
              const [, col] = asset;
              const collection = collections.find(
                (predict) => predict.symbol === col.collectionName
              );
              return new Promise(async (resolve, _) => {
                const { data } = await API_METHODS.get(
                  `${apiUrl.Asset_server_base_url}/api/v2/fetch/collection/${col.collectionName}`
                );
                resolve({ ...col, ...data.data, ...collection });
              });
            });

            const collectionDetails = await Promise.all(collectionPromise);
            const finalResult = collectionDetails.map((col) => {
              const { yield: yields, terms } = col;
              const term = Number(terms);
              const APY = calculateAPY(yields, term);
              const LTV = 0;
              return {
                ...col,
                terms: term,
                APY,
                LTV,
              };
            });
            dispatch(setApprovedCollection(finalResult));
          }
          dispatch(setCollection(collections));
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_agent, dispatch]);

    const fetchBnBPrice = async () => {
      try {
        const bnbData = await API_METHODS.get(
          `${process.env.REACT_APP_COINGECKO_API}?ids=binancecoin&vs_currencies=usd`
        );
        if (bnbData.data?.binancecoin) {
          const bnbValue = bnbData.data.binancecoin.usd;
          dispatch(setBnbValue(bnbValue));
        } else {
          fetchBnBPrice();
          if (!bnbValue) dispatch(setBnbValue(1.82));
        }
      } catch (error) {
        // Notify("error", "Failed to fetch Aptos");
      }
    };

    useEffect(() => {
      (() => {
        setInterval(async () => {
          fetchBnBPrice();
        }, [300000]);
        return () => clearInterval();
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api_agent, dispatch]);

    useEffect(() => {
      //Fetching BTC Value
      fetchBTCLiveValue();

      fetchBnBPrice();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
        redux={{ dispatch, reduxState }}
        wallet={{
          api_agent,
          isEthConnected,
        }}
      />
    );
  }
  return ComponentWithRouterProp;
};
