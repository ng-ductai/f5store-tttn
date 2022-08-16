// main.js
const nodemailer = require("nodemailer");
const helpers = require("../helpers");

// configure option
const option = {
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.NODE_MAILER_USER,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
};

const transporter = nodemailer.createTransport(option);

// send email
const sendEmail = async ({ to, subject, text, html, ...rest }) => {
  try {
    const res = await transporter.verify();
    if (res) {
      //config mail
      const mail = {
        //sender access
        from: '"F5 Store" <ductai2982@gmail.com>',
        //receiver access
        to,
        //subject
        subject,
        //content text
        text,
        //html
        html,
        //others
        ...rest,
      };
      //Tiến hành gửi email
      const info = await transporter.sendMail(mail);
      if (info) {
        return true;
      }
    }
  } catch (err) {
    console.error("ERROR MAILER: ", err);
    return false;
  }
};

const headerHtmlMail = `<h1 style="color: #4267b2; font-size: 40px; border-bottom: solid 2px #ccc;padding-bottom: 6px">
      F5 Store<br />
    </h1>`;

const footerHtmlVerifyMail = `
    <h3 style="color: red">
      Lưu ý: 
        Không đưa mã này cho bất kỳ ai, có thể dẫn đến mất tài khoản.<br />
        <h3 style="padding-left: 50px; color: red">  
            Mã chỉ có hiệu lực <i>10 phút </i> từ khi bạn nhận được mail.
        </h3>
    </h3>
    <h2 style="color: #000">Cảm ơn quý khách đã ghé thăm F5 Store !!!</h2>
  `;

// gửi mã xác nhận
const htmlSignupAccount = (token) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 6px 0; margin-bottom: 10px; color: #000">
        Xin chào,<br />
        Mã xác nhận đăng ký tài khoản website F5 Store của anh (chị).<br /> 
    </h2>
    <h2 style="background: #eee; padding: 10px;">
      <i><b>${token}</b></i>
    </h2>
  ${footerHtmlVerifyMail}
  </div>`;
};

// gửi mã đổi mật khẩu
const htmlResetPassword = (token) => {
  return `<div>
    ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin chào,<br />
        Cửa hàng F5 Store đã nhận được yêu cầu lấy lại mật khẩu từ quý khách.<br />
        Đừng lo lắng, hãy nhập mã này để khôi phục:
    </h2>
    <h1 style="background: #eee;padding: 10px;">
      <i><b>${token}</b></i>
    </h1>
    ${footerHtmlVerifyMail}
  </div>`;
};

// gửi thông báo đăng nhập sai quá nhiều
const htmlWarningLogin = () => {
  return `<div>
   ${headerHtmlMail}
    <h2 style="padding: 10px 0; margin-bottom: 10px;">
        Xin Chào anh (chị),<br />
        Cửa hàng nghi ngờ có ai đó đã cố gắng đăng nhập vào tài khoản của quý khách.<br />
        Nếu quý khác không nhớ mật khẩu hãy nhấn vào "Quên mật khẩu" để lấy lại mật khẩu<br/>
    </h2>
    <h1>Cảm ơn.</h1>
  </div>`;
};

// gửi mail xác nhận đơn hàng
const htmlOrder = (
  fullName,
  name,
  phone,
  addressStr,
  paymentMethod,
  transportMethod,
  transportFee,
  orderDate,
  temp_Money,
  total_Money,
  orderProd,
  note
) => {
  return `
  <div style="margin-left: 120px; margin-right: 120px; text-align: center; ">
    <div style="margin-left: auto; margin-right: auto; text-align: center; ">  
      <h2 style="color: #4267b2; font-weight: 700; font-size: 22px; ">
        Xin chào ${fullName}<br />
      </h2>
      <p style=" font-size: 14px; "> Bạn đã đặt hàng tại F5 Store. Vui lòng kiểm tra lại đơn hàng của bạn !</p>
    </div>

    <div style="display: flex; margin-left: auto; margin-right: auto; text-align: center; ">
      <div style=" display: flex; text-align: right; margin-right: 50px;  width: 50%; "> 
        <div style=" text-align: right; margin-right: 20px;  width: 35%; "> 
          <p style=" font-size: 15px; "> Họ tên  </p>
          <p style=" font-size: 15px; "> Số điện thoại </p>
          <p style=" font-size: 15px; "> Địa chỉ </>
        </div>
        <div style=" text-align: left; "> 
          <p style=" font-size: 15px; "> ${name} </p>
          <p style=" font-size: 15px; "> ${phone}</p>
          <p style=" font-size: 15px; "> ${addressStr}</>
        </div>
      </div>
    
      <div style=" display: flex; text-align: right; "> 
        <div style=" text-align: right; margin-right: 20px; "> 
          <p style=" font-size: 15px; "> Ngày đặt hàng  </p>
          <p style=" font-size: 15px; "> Đơn vị vận chuyển </p>
          <p style=" font-size: 15px; "> Phương thức thanh toán </>
        </div>
        <div style =" text-align: left; "> 
          <p style=" font-size: 15px; "> ${orderDate} </p>
          <p style=" font-size: 15px; "> ${transportMethod}</p>
          <p style=" font-size: 15px; "> ${paymentMethod} </>
        </div>
      </div>
    </div>

    <div style = "margin-left: auto; margin-right: auto; ">   
      <table style = "border: 1px solid black; border-collapse: collapse; width: 800px; height: auto; ">
        <tr>
          <th style ="border: 1px solid #666; border-collapse: collapse; padding: 8px; width: 50px; "> STT </th>
          <th style ="border: 1px solid #666; border-collapse: collapse; padding: 8px; width: 100px; "> Hình ảnh </th>
          <th style ="border: 1px solid #666; border-collapse: collapse; padding: 8px; width: 350px; "> Sản phẩm </th>
          <th style ="border: 1px solid #666; border-collapse: collapse; padding: 8px; width: 125px; "> Giá </th>
          <th style ="border: 1px solid #666; border-collapse: collapse; padding: 8px; width: 50px; "> Số lượng </th>
          <th style ="border: 1px solid #666; border-collapse: collapse; padding: 8px; width: 125px; "> Tồng tiền </th>
        </tr>
        ${orderProd.map((val, key) => {
          return `
              <tr key=${key + 1}>
                <td style ="text-align: center; font-size: 16px;  padding: 8px; width: 50px; ">
                  ${val.key}
                </td>
                <td style ="text-align: center;  padding: 8px; width: 100px; "> 
                  <img style="width: 70px; height: 70px; " src=${val.avt} /> 
                </td>
                <td style ="text-align: center; font-size: 16px;  padding: 8px; width: 350px; ">
                  ${val.name}
                </td>
                <td style ="text-align: center; font-size: 16px;  padding: 8px; width: 125px; ">
                  ${helpers.formatProductPrice(val.price)}
                </td>
                <td style ="text-align: center; font-size: 16px;  padding: 8px; width: 50px; ">
                  ${val.amount}
                </td>
                <td style ="text-align: center; font-size: 16px;  padding: 8px; width: 125px; ">
                  ${helpers.formatProductPrice(val.amount * val.price)}
                </td>
              </tr>
            `;
        })}
      </table>
    </div>

  
    <div style = " display: flex; margin-left: 10px; margin-right: 10px; text-align: left ">   
      <p style=" font-size: 16px; "> Ghi chú: ${note}</p>
    </div> 
        

    <div style ="  padding-right: 40px; padding-left: 60%; ">
      <div style ="display: flex; text-align: right; "> 
        <div style =" text-align: right; margin-right: 20px; "> 
          <p style=" font-size: 16px; "> Tạm tính  </p>
          <p style=" font-size: 16px; "> Phí vận chuyển</p>
          <p style=" font-size: 16px; padding-top: 8px; "> Tổng tiền </>
        </div>
        <div style =" text-align: right; "> 
          <p style=" font-size: 16px; "> ${temp_Money} </p>
          <p style=" font-size: 16px; "> ${transportFee} </p>
          <p style=" font-size: 20px; color: red "> ${total_Money} </>
        </div>
      </div>
    </div>

  </div>`;
};

module.exports = {
  sendEmail,
  htmlSignupAccount,
  htmlResetPassword,
  htmlWarningLogin,
  htmlOrder,
};
