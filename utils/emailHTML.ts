export default function emailHTML({
  name,
  link,
}: {
  name: string;
  link: string;
}) {
  return `  
   <!DOCTYPE html >
  <html lang="en">
    <head>
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
    </head>
    <body
      style="
        background-color: rgb(255, 255, 255);
        margin-top: auto;
        margin-bottom: auto;
        margin-left: auto;
        margin-right: auto;
        font-family:
          ui-sans-serif, system-ui, sans-serif, &quot;Apple Color Emoji&quot;,
          &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;,
          &quot;Noto Color Emoji&quot;;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      "
    >
      <table
        align="center"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="
          border-width: 1px;
          border-style: solid;
          border-color: rgb(234, 234, 234);
          border-radius: 0.25rem;
          margin-top: 40px;
          margin-bottom: 40px;
          margin-left: auto;
          margin-right: auto;
          padding: 20px;
          max-width: 465px;
        "
      >
        <tbody>
          <tr style="width: 100%">
            <td>
              <table
                align="center"
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="margin-top: 32px"
              >
              </table>
              <h1
                style="
                  color: rgb(0, 0, 0);
                  font-size: 24px;
                  font-weight: 400;
                  text-align: center;
                  padding: 0px;
                  margin-top: 30px;
                  margin-bottom: 30px;
                  margin-left: 0px;
                  margin-right: 0px;
                "
              >
                ~ <strong>Verify</strong> your  <strong>Email</strong>
              </h1>
              <p
                style="
                  color: rgb(0, 0, 0);
                  font-size: 14px;
                  line-height: 24px;
                  margin: 16px 0;
                "
              >
                Hello <strong>${name}</strong> 
              </p>
              <p
                style="
                  color: rgb(0, 0, 0);
                  font-size: 14px;
                  line-height: 24px;
                  margin: 16px 0;
                "
              >
              Click to verfiy your email | expires in 30 minutes
              </p>
              <table
                align="center"
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="text-align: center; margin-top: 32px; margin-bottom: 32px"
              >
                <tbody>
                  <tr>
                    <td>
                      <a
                        href="${link}"
                        style="
                          background-color: rgb(0, 0, 0);
                          border-radius: 0.25rem;
                          color: rgb(255, 255, 255);
                          font-size: 12px;
                          font-weight: 600;
                          text-decoration-line: none;
                          text-align: center;
                          padding-left: 1.25rem;
                          padding-right: 1.25rem;
                          padding-top: 0.75rem;
                          padding-bottom: 0.75rem;
                          line-height: 100%;
                          text-decoration: none;
                          display: inline-block;
                          max-width: 100%;
                          mso-padding-alt: 0px;
                          padding: 12px 20px 12px 20px;
                        "
                        target="_blank"
                        ><span
                          ></span
                        ><span
                          style="
                            max-width: 100%;
                            display: inline-block;
                            line-height: 120%;
                            mso-padding-alt: 0px;
                            mso-text-raise: 9px;
                          "
                          >Verify Email</span
                        ><span
                          ></span
                        ></a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
              <p
                style="
                  color: rgb(0, 0, 0);
                  font-size: 14px;
                  line-height: 24px;
                  margin: 16px 0;
                "
              >
                or copy and paste this URL into your browser:<!-- -->
                <a
                  href=${link}
                  style="color: rgb(37, 99, 235); text-decoration-line: none"
                  target="_blank"
                  >${link}</a
                >
              </p>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <!--/$-->
    </body>
  </html>
    `;
}
