import React from "react";
import { Link } from "react-router-dom";
import { PRIVACY_POLICY_ROUTE } from "../../document/constants/constants";

export const CookieStatementContent = () => {
  return (
    <div className="impr" id="impr-pp">
      <div className="impr-pp-header">
        <p className="impr-subheader">
          <span>Cookie statement &ndash; GDPR-compliant, </span>
          <u>with Google opt-in</u>
          <br />
          <span>&ndash; English &ndash;</span>
        </p>
        <br />
      </div>

      <p>
        We, amp GmbH, Sandstr. 33, 80335 Munich, Germany, use cookies and
        similar software tools such as Web/DOM Storage or Local Shared Objects
        (so-called &#34;flash cookies&#34;) (collectively &#34;cookies&#34;).
        Further information about the function, use and purpose of cookies can
        be found below. Supplementary information about the handling of personal
        data, also in cookies, can be found in our data protection notes
        (specifically in sections 3, 4 and 5).
      </p>
      <p>
        <Link to={PRIVACY_POLICY_ROUTE}>Privacy Statement</Link>
      </p>

      <p className="impr-subheader">1. Function and Use of Cookies</p>
      <ol type="a">
        <li>
          <p>
            Cookies are small files stored on your desktop, laptop or mobile
            device by websites visited by you. They enable us to e.g. recognize
            whether there has been a previous connection between your device and
            our websites, take into account your preferred language or other
            settings, offer you certain functionalities (e.g. online shop,
            vehicle configurator) or recognize your interests on the basis of
            previous use. Cookies can also contain personal information.
          </p>
        </li>
        <li>
          <p>If you use our websites, you consent to the use of cookies.</p>
          <p>
            You can also visit our websites without consenting to the use of
            cookies by such use. In other words, you can reject the use of
            cookies and delete them at any time by making the appropriate
            settings to your device.
          </p>
          <ol type="i">
            <li>
              <p>
                Most browsers are set to accept cookies automatically by
                default; you are usually able to alter this setting. You can
                delete stored cookies at any time. The manufacturer&#39;s
                instructions will tell you how this is done in the browser or
                device you use.
              </p>
            </li>
            <li>
              <p>
                You can delete the content of Web/DOM Storage at any time. The
                manufacturer&#39;s instructions will tell you how this is done
                in the browser or device you use.
              </p>
            </li>
            <li>
              <p>
                Information on deactivating and deleting local shared objects
                can be found at the following link:
              </p>
              <br />
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager02.html"
                >
                  Information on local shared objects
                </a>
              </p>
            </li>
            <li>
              <p>
                The same rules that apply to the use of cookies also apply to
                rejecting or deleting them. The procedure is tied to the device
                being used as well as the browser being used with that device.
                In other words, you will need to reject or delete the cookies
                separately for each of your devices and each browser if you use
                more than one.
              </p>
            </li>
          </ol>
          <li>
            <p>
              If you opt out of the use of cookies, you may not be able to use
              all the features of our websites, or individual features may be
              available with limited functionality only.
            </p>
          </li>
          <li>
            <p>We categorize cookies as follows:</p>
          </li>
          <ol type="i">
            <li>
              <p>
                <span style={{ fontStyle: "italic" }}>
                  Essential cookies (type 1)
                </span>
                <br />
                These cookies are essential for websites and their features to
                work properly. Without these{" "}
              </p>
            </li>
            <li>
              <p>
                <span style={{ fontStyle: "italic" }}>
                  Functional cookies (type 2)
                </span>
                <br />
                These cookies enable us to improve the usability and performance
                of our websites. For example, we store your language settings in
                functional cookies.
              </p>
            </li>
            <li>
              <p>
                <span style={{ fontStyle: "italic" }}>
                  Performance cookies (type 3)
                </span>
                <br />
                These cookies collect information about how you use our
                websites. They help us to identify which parts of our websites
                are especially popular, enabling us to improve what we offer you
                (so-called. tracking). Further information about this can be
                found in section 5 of our data protection notes.
                <br />
                <br />
                <br />
                <Link to={PRIVACY_POLICY_ROUTE}>Privacy Statement</Link>
              </p>
            </li>
          </ol>
          <p>We use the following cookies on our website:</p>
        </li>
      </ol>
      <table width="600">
        <tbody>
          <tr style={{ backgroundColor: "black" }}>
            <td width="166">
              <p
                style={{
                  color: "var(--color-white)",
                  textAlign: "center",
                }}
              >
                Cookie Name
              </p>
            </td>
            <td width="273">
              <p
                style={{
                  color: "var(--color-white)",
                  textAlign: "center",
                }}
              >
                <strong>Description</strong>
              </p>
            </td>
            <td width="101">
              <p
                style={{
                  color: "var(--color-white)",
                  textAlign: "center",
                }}
              >
                <strong>Cookie Type</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td width="166">
              <p
                style={{
                  fontWeight: 600,
                }}
              >
                &nbsp;_ga
              </p>
            </td>
            <td width="273">
              <p>
                Used to distinguish users when the person visits the website for
                the first time.&nbsp;
              </p>
            </td>
            <td width="101">
              <p>type 3</p>
            </td>
          </tr>
          <tr>
            <td width="166">
              <p
                style={{
                  fontWeight: 600,
                }}
              >
                &nbsp;_gid
              </p>
            </td>
            <td width="273">
              <p>Used to group the user behavior together for each user.</p>
            </td>
            <td width="101">
              <p>type 3</p>
            </td>
          </tr>
          <tr>
            <td width="166">
              <p
                style={{
                  fontWeight: 600,
                }}
              >
                &nbsp;_gat
              </p>
            </td>
            <td width="273">
              <p>
                Used to throttle request rate. If Google Analytics is deployed
                via Google Tag Manager, this cookie will be named
                _dc_gtm_&lt;property-id&gt;.
              </p>
            </td>
            <td width="101">
              <p>type 3</p>
            </td>
          </tr>
          <tr>
            <td width="166">
              <p
                style={{
                  fontWeight: 600,
                }}
              >
                &nbsp;Jwt-cookie
              </p>
            </td>
            <td width="273">
              <p>Authentication cookie.</p>
            </td>
            <td width="101">
              <p>type 1 and 2</p>
            </td>
          </tr>
          <tr>
            <td width="166">
              <p
                style={{
                  fontWeight: 600,
                }}
              >
                &nbsp;_iub_cs
              </p>
            </td>
            <td width="273">
              <p>This cookie stores cookie consent preferences.</p>
            </td>
            <td width="101">
              <p>type 1 and 2</p>
            </td>
          </tr>
          <tr>
            <td width="166">
              <p>
                <strong>&nbsp;</strong>
              </p>
            </td>
            <td width="273">
              <p>&nbsp;</p>
            </td>
            <td width="101">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td width="166">
              <p>
                <strong>&nbsp;</strong>
              </p>
            </td>
            <td width="273">
              <p>&nbsp;</p>
            </td>
            <td width="101">
              <p>&nbsp;</p>
            </td>
          </tr>
          <tr>
            <td width="166">
              <p>
                <strong>&nbsp;</strong>
              </p>
            </td>
            <td width="273">
              <p>&nbsp;</p>
            </td>
            <td width="101">
              <p>&nbsp;</p>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <p>Last update: November 2018</p>
    </div>
  );
};
