import { Button, Checkbox, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./constants/api";

function Login() {
  const navigate = useNavigate();

  const onFinish = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "reqres-free-v1",
        },
        body: JSON.stringify({
          username: "eve.holt@reqres.in",
          email: "eve.holt@reqres.in",
          password: "cityslicka",
        }),
      });
      const data = await response.json();
      if (data.token) {
        navigate("/users");
      }
      message.success("Login successful!");
    } catch (error) {
      message.error("Login failed! Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#DEDEDE]">
      <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-md">
        <p className="text-2xl font-bold mb-5 text-center">Login</p>
        <Form
          name="login_form"
          initialValues={{
            email: "eve.holt@reqres.in",
            password: "cityslicka",
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Please enter a valid Email!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="User Name"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{ borderRadius: 4 }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
