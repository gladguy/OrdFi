import { Result, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../component/Button";

const Page404 = () => {
  const navigate = useNavigate();
  const { Text } = Typography;

  return (
    <Result
      className="mt-70"
      status="404"
      title={
        <Text className="text-color-one font-xlarge font-weight-600 letter-spacing-medium">
          404
        </Text>
      }
      subTitle={
        <Text className="text-color-one font-large letter-spacing-small">
          Sorry, the page you visited does not exist.
        </Text>
      }
      extra={
        <CustomButton
          className={"click-btn font-weight-600 letter-spacing-small"}
          title={"Go Back"}
          onClick={() => {
            navigate("/");
          }}
        />
      }
    />
  );
};

export default Page404;
