import React from "react";
import { Form, Button, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../api/users";

function Login() {
  const navigate = useNavigate();
  const onFinish = async (value) => {
    try {
      const response = await LoginUser(value);
      if (response.success) {
        console.log(response);
        message.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
      } else {
        message.error(response.message);
      }
    } catch (err) {
      console.log(err);
      message.error(message.error);
    }
  };
  return (
    <>
      <main className="App-header">
        <h1>Login to Book My Show</h1>
        <section className="mw-500 text-center px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              htmlFor="email"
              name="email"
              className="d-block"
              rules={[
                {
                  required: true,
                  message: "Email is required",
                },
                {
                  type: "email",
                  message: "please enter a valid email",
                },
              ]}
            >
              <Input
                id="email"
                type="text"
                placeholder="Enter Your email"
              ></Input>
            </Form.Item>
            <Form.Item
              label="Password"
              htmlFor="password"
              name="password"
              className="password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
              ]}
            >
              <Input
                id="password"
                type="password"
                placeholder="Enter Your Password"
              ></Input>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ fontSize: "1.5rem", fontWeight: "600" }}
              >
                Login
              </Button>
            </Form.Item>
            <div>
              <p>
                New User? <Link to="/register">Register</Link>
              </p>
              <p>
                Forget Password? <Link to="/forget">Click Here</Link>
              </p>
            </div>
          </Form>
        </section>
      </main>
    </>
  );
}

export default Login;
