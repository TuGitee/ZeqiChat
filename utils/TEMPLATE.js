const getTime = require('./TIME');
module.exports = (method, to, captcha) => `<div>
<includetail>
    <style>
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        .hidden {
            display: none !important;
            visibility: hidden !important;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        body {
            margin: 0 !important;
        }

        div[style*="margin: 16px 0"] {
            margin: 0 !important;
        }

        @media only screen and (max-width: 639px) {
            body, #body {
                min-width: 320px !important;
            }

            table.wrapper {
                width: 100% !important;
                min-width: 320px !important;
            }
        }
    </style>
    <style>
        body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        body {
            margin: 0 !important;
        }
    </style>


    <table border="0" cellpadding="0" cellspacing="0" id="body"
           style="text-align: center; min-width: 640px; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0; padding: 0;"
           bgcolor="#fafafa">
        <tbody>
        <tr class="line">
            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; height: 4px; font-size: 4px; line-height: 4px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                bgcolor="#C32F01">&nbsp;
            </td>
        </tr>
        <tr class="header">
            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 25px 0;">
                <img src="https://zeqichat.xyz/favicon.ico" width="50" height="50"
                     style="-ms-interpolation-mode: bicubic;">
            </td>
        </tr>
        <tr>
            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <table border="0" cellpadding="0" cellspacing="0" class="wrapper"
                       style="width: 640px; border-collapse: separate; border-spacing: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0 auto;">
                    <tbody>
                    <tr>
                        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; border-radius: 3px; overflow: hidden; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 18px 25px; border: 1px solid #ededed;"
                            align="left" bgcolor="#ffffff">
                            <table border="0" cellpadding="0" cellspacing="0" class="content"
                                   style="width: 100%; border-collapse: separate; border-spacing: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                <tr>
                                    <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; color: #333333; font-size: 15px; font-weight: 400; line-height: 1.4; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 15px 5px;"
                                        align="center">
                                        <h1 style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; color: #333333; font-size: 18px; font-weight: 400; line-height: 1.4; margin: 0; padding: 0;"
                                            align="center">
                                            您好，${to}！
                                        </h1>
                                        <p>
                                            您的${method}验证码为：
                                        </p>
                                        <div id="cta">
                                            <h1 style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;color: #C32F01;display:flex;margin: auto;justify-content:center;align-items:center;gap:10px;padding: 30px 0;letter-spacing:2rem;text-indent: 2rem;">${captcha}</h1>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr class="footer">
            <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; font-size: 13px; line-height: 1.6; color: #5c5c5c; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 25px 0;width: 32px;height:32px;">
                

                <div style="width: 80%;margin: auto;"> 您收到这封电子邮件是因为您正在${method}「择栖聊天室」，验证码五分钟有效，请勿泄露与转发。
                </div>
                <br/>
                <div><span style="color: #C32F01">择栖工作室</span> · ${getTime()}</div>
            </td>
        </tr>

        </tbody>
    </table>
</includetail>
</div>
    `