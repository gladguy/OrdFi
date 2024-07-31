import {
  Col,
  Divider,
  Flex,
  Grid,
  Row,
  Skeleton,
  Tooltip,
  Typography,
} from "antd";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import bitcoin from "../../assets/coin_logo/bnb_coin.png";
import borrows from "../../assets/logo/Borrowing.png";
import lends from "../../assets/logo/Lending.png";
import CardDisplay from "../../component/card";
import { propsContainer } from "../../container/props-container";
import CustomButton from "../../component/Button";

const Home = (props) => {
  const { reduxState } = props.redux;
  const collections = reduxState.constant.approvedCollections;
  const bnbValue = reduxState.constant.bnbValue;
  const btcvalue = reduxState.constant.btcvalue;

  const { Title, Text } = Typography;
  const { useBreakpoint } = Grid;
  const breakpoints = useBreakpoint();

  const [collectionList, setCollectionList] = useState(collections.slice(0, 9));

  const BTC_ZERO = process.env.REACT_APP_BTC_ZERO;

  gsap.to(".box", {
    y: 10,
    stagger: {
      // wrap advanced options in an object
      each: 0.1,
      from: "center",
      grid: "auto",
      ease: "power2.inOut",
      repeat: 1, // Repeats immediately, not waiting for the other staggered animations to finish
    },
  });

  useEffect(() => {
    if (collections[0]) {
      setCollectionList(collections.slice(0, 9));
    }
  }, [collections]);

  return (
    <React.Fragment>
      <Row
        className="mt-200 p-relative"
        align={"middle"}
        justify={"space-evenly"}
      >
        <Col
          className="p-relative dash-collection"
          md={8}
          style={{
            minHeight: "300px",
          }}
        >
          <img
            style={{
              position: "absolute",
              right: "38%",
              top: "30%",
            }}
            alt="img"
            className="border-radius-50 dash-col pointer random-move"
            width={110}
            src={`${process.env.PUBLIC_URL}/collections/dmtnatcats.png`}
          />
          <img
            style={{
              position: "absolute",
              top: "5%",
            }}
            alt="img"
            className="border-radius-50 dash-col pointer random-move"
            width={190}
            src={`${process.env.PUBLIC_URL}/collections/bitcoin-punks.png`}
          />
          <img
            style={{
              position: "absolute",
              top: "50%",
              left: "58%",
            }}
            alt="img"
            className="border-radius-50 dash-col pointer random-move"
            width={140}
            src={`${process.env.PUBLIC_URL}/collections/bitcoin-frogs.png`}
          />
          <img
            style={{
              position: "absolute",
              right: "42%",
            }}
            alt="img"
            className="border-radius-50 dash-col pointer random-move"
            width={90}
            src={`${process.env.PUBLIC_URL}/collections/goosinals.png`}
          />
          <img
            style={{
              position: "absolute",
              right: "50px",
            }}
            alt="img"
            className="border-radius-50 dash-col pointer random-move"
            width={150}
            src={`${process.env.PUBLIC_URL}/collections/blockmunchers.png`}
          />
        </Col>

        <Col md={11} className="p-relative">
          <div className="coin">
            <div className="side heads">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                width="100%"
                height="100%"
                version="1.1"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                imageRendering="optimizeQuality"
                fillRule="evenodd"
                clipRule="evenodd"
                viewBox="0 0 4091.27 4091.73"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                  <g id="_1421344023328">
                    <path
                      fill="#F7931A"
                      fillRule="nonzero"
                      d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"
                    ></path>
                    <path
                      fill="white"
                      fillRule="nonzero"
                      d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
            <div className="side tails">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="svg_back"
                xmlSpace="preserve"
                width="100%"
                height="100%"
                version="1.1"
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
                imageRendering="optimizeQuality"
                fillRule="evenodd"
                clipRule="evenodd"
                viewBox="0 0 4091.27 4091.73"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g id="Layer_x0020_1">
                  <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                  <g id="_1421344023328">
                    <path
                      fill="#F7931A"
                      fillRule="nonzero"
                      d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z"
                    ></path>
                    <path
                      fill="white"
                      fillRule="nonzero"
                      d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z"
                    ></path>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <Flex vertical gap={40}>
            <Flex vertical gap={55}>
              <Text className="heading-one font-xxxlarge text-color-four">
                Borrow BTC!
              </Text>
              <Text className="heading-one font-xxxlarge text-color-four">
                Earn Interest!
              </Text>
            </Flex>
            <Flex gap={20}>
              <CustomButton
                className="button-css-dark font-weight-600 letter-spacing-small"
                title={"Borrow"}
              />
              <CustomButton
                className="button-css-dark font-weight-600 letter-spacing-small"
                title={"Lend"}
              />
            </Flex>
            <Text className="card-box-one font-small text-color-two">
              Borrow Bitcoin using your Inscriptions, Ordinals, and tokens as
              collateral. This allows you to access funds without selling your
              assets. Lend your Bitcoin and earn significant returns, with
              potential annual percentage yields (APY) of up to 350%. This
              provides a mutually beneficial opportunity for both borrowers
              seeking liquidity and lenders looking to maximize their earnings.
            </Text>
          </Flex>
        </Col>

        <Col
          className="design-gradient"
          style={{
            position: "absolute",
            width: "50%",
            height: "400px",
            left: "-75px",
            zIndex: "-1",
          }}
        />
      </Row>

      <Row className="mt-150" justify={"center"}>
        <Col md={1}>
          <Divider />
        </Col>
      </Row>

      {/* Borrows */}
      <Row
        className="mt-150 p-relative"
        align={"middle"}
        justify={"space-between"}
      >
        <Col>
          <img
            alt="img"
            className="dash-col pointer card-box-shadow-light border-radius-50px"
            width={600}
            src={borrows}
          />
        </Col>

        <Col md={10}>
          <Flex vertical gap={55}>
            <Text className="heading-one font-xxxlarge text-color-four">
              Unlock Credit!
            </Text>
            <Text className="card-box-one font-medium text-color-two">
              By creating a borrow request using your selected collateral, you
              can secure the funds you need, and once a lender accepts your
              request, the lent money will be credited directly to your account
              for immediate use.
            </Text>
          </Flex>
        </Col>

        <Col
          className="design-gradient"
          style={{
            position: "absolute",
            width: "40%",
            height: "400px",
            right: 0,
            top: 0,
            zIndex: "-1",
          }}
        />
      </Row>

      <Row className="mt-150 " justify={"center"}>
        <Col md={1}>
          <Divider />
        </Col>
      </Row>

      {/* Lends */}
      <Row
        className="mt-150 p-relative"
        align={"middle"}
        justify={"space-between"}
      >
        <Col md={10}>
          <Flex vertical gap={55}>
            <Text className="heading-one font-xxxlarge text-color-four">
              Grant a Hand!
            </Text>
            <Text className="card-box-one font-medium text-color-two">
              By backing a borrower's loan request with your money, you empower
              them to overcome financial obstacles and, in return, receive
              lucrative interest payments that can boost your earnings.
            </Text>
          </Flex>
        </Col>

        <Col>
          <img
            alt="img"
            className="dash-col pointer card-box-shadow-light border-radius-50px"
            width={600}
            src={lends}
          />
        </Col>

        <Col
          className="design-gradient"
          style={{
            position: "absolute",
            width: "40%",
            height: "400px",
            left: 0,
            top: 0,
            zIndex: "-1",
          }}
        />
      </Row>

      <Row className="mt-150 " justify={"center"}>
        <Col md={1}>
          <Divider />
        </Col>
      </Row>

      {/* Collections */}
      <Row className="mt-150">
        <Col>
          <Title level={breakpoints.xs ? 3 : 2} className="gradient-text-two">
            Bitcoin Ordinal Collections
          </Title>
        </Col>
      </Row>

      <Row justify={"start"} className="pad-bottom-30" gutter={32}>
        {collectionList?.map((collection, index) => {
          const name = collection?.name;
          const nameSplitted = collection?.name?.split(" ");
          let modifiedName = "";
          nameSplitted?.forEach((word) => {
            if ((modifiedName + word).length < 25) {
              modifiedName = modifiedName + " " + word;
            }
          });
          const floor = collection?.floorPrice ? collection?.floorPrice : 30000;

          return (
            <Col
              key={`${collection?.symbol}-${index}`}
              lg={8}
              md={12}
              sm={12}
              xs={24}
            >
              <Skeleton loading={!collection.symbol} active>
                <CardDisplay
                  className={
                    "main-bg dashboard-card-padding m-top-bottom dashboard-cards pointer box collection-bg"
                  }
                >
                  <Row justify={"center"}>
                    <Col>
                      <div style={{ display: "grid", placeContent: "center" }}>
                        {name?.length > 35 ? (
                          <Tooltip arrow title={name}>
                            <Text className="heading-one text-color-four font-medium">
                              {`${modifiedName}...`}
                            </Text>
                          </Tooltip>
                        ) : (
                          <Text className="heading-one font-medium text-color-four">
                            {modifiedName}
                          </Text>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row
                    justify={{ xs: "space-between", md: "center" }}
                    align={"middle"}
                    className={breakpoints.xs || breakpoints.md ? "mt-5" : ""}
                    gutter={breakpoints.xs || breakpoints.md ? [0, 12] : []}
                  >
                    <Col xs={24} md={24} lg={5} xl={5}>
                      <Row justify={"center"}>
                        <img
                          className="border-radius-5 loan-cards"
                          width={"90px"}
                          height={"75dvw"}
                          alt={name}
                          src={collection?.imageURI}
                          onError={(e) =>
                            (e.target.src = `${process.env.PUBLIC_URL}/collections/${collection?.symbol}.png`)
                          }
                          // src={`${process.env.PUBLIC_URL}/collections/${collection?.symbol}.png`}
                        />
                      </Row>
                    </Col>

                    <Col xs={24} sm={20} md={20} lg={18} xl={18}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "auto auto",
                          gridAutoFlow: "row",
                          gridColumnGap: "10px",
                          placeContent: "center",
                        }}
                      >
                        <div>
                          <Text className="font-medium text-color-two">
                            Floor
                          </Text>
                        </div>

                        <div>
                          <Flex
                            gap={3}
                            align="center"
                            className="font-medium text-color-two"
                          >
                            <img src={bitcoin} alt="noimage" width={20} />
                            {(
                              ((floor / BTC_ZERO) * btcvalue) /
                              bnbValue
                            ).toFixed(2)}
                          </Flex>
                        </div>

                        <div>
                          <Text className="font-medium text-color-two">
                            Volume
                          </Text>
                        </div>

                        <div>
                          <Flex gap={3} className="font-medium text-color-two">
                            <img
                              src={bitcoin}
                              alt="noimage"
                              width={20}
                              height={22}
                            />
                            {(
                              ((collection.totalVolume / BTC_ZERO) * btcvalue) /
                              bnbValue
                            ).toFixed(2)}
                          </Flex>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardDisplay>
              </Skeleton>
            </Col>
          );
        })}
      </Row>

      <Row justify={"center"} className="m-bottom">
        <Col>
          <Text
            className="font-large pointer gradient-text-two"
            onClick={() =>
              setCollectionList(
                collectionList.length > 10
                  ? collections.slice(0, 9)
                  : collections
              )
            }
          >
            {collectionList.length > 10 ? "Hide" : "View all"}
          </Text>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default propsContainer(Home);
