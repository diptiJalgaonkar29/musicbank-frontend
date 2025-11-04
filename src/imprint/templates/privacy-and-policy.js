import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { COOKIE_STATEMENT_ROUTE } from "../../document/constants/constants";
import getConfigJson from "../../common/utils/getConfigJson";
import { BrandingContext } from "../../branding/provider/BrandingContext";

export const PrivacyAndPolicyContent = () => {
  const { jsonConfig: CONFIG } = useContext(BrandingContext);
  const BRAND_NAME = CONFIG?.BRANDING;
  const BRAND_NAME_TERTIARY = CONFIG?.BRAND_NAME_TERTIARY;
  return (
    <div className="impr">
      <div className="impr-pp-header">
        <p className="impr-subheader">
          <span>Privacy statement &ndash; GDPR-compliant, </span>
          <u>with Google opt-in</u>
          <br />
          <span>&ndash; English &ndash;</span>
        </p>
        <br />
      </div>
      <p className="impr-subheader">
        The controller defined by the General Data Protection Regulation (GDPR)
        is:
      </p>
      <p>
        amp GmbH (&#34;We&#34;)
        <br />
        Sandstr. 33
        <br /> 80335 Munich
        <br /> Germany
        <br /> Email: data.protection@ampcontact.com
      </p>
      <br />
      <br />
      <p className="impr-subheader">1. Data Protection</p>
      <ol className="impr-list-none">
        <li>
          <p>
            We appreciate you visiting our website and your interest in the
            products we offer. Protecting your personal data is very important
            to us. In this Privacy Policy, we explain how we collect your
            personal information, what we do with it, for what purposes and on
            what legal foundation we do so, and what rights you have on that
            basis.&nbsp;
          </p>
          <p>
            Our Privacy Statement on the use of our websites do not apply to
            your activities on the websites of social networks or other
            providers that can be accessed using the links on our websites.
            Please read the data protection provisions on the websites of those
            providers.
          </p>
        </li>
      </ol>

      <p className="impr-subheader">
        2. Collecting and processing your personal data
      </p>
      <ol type="a">
        <li>
          <p>
            Whenever you visit our websites, we store certain information about
            the browser, the browser version and operating system you are using;
            access to the website (date, time and frequency); how you arrived at
            the website (referring page, hyperlink, etc.); volume of data sent;
            the internet service provider that you are using, the IP address
            that your internet service provider assigns to your computer when
            connecting to the internet. The collection and storage of this data
            is required for the operation of the website in order to provide the
            website functionality and correctly deliver the content of our
            website. We also use the data to optimize our website and ensure the
            security of our IT systems. For this reason, the data is stored for
            a maximum of seven days as a technical precaution.
          </p>
        </li>

        <li>
          <p>
            We only store other personal data if you provide this data, e.g. as
            part of a registration, a contact form, a survey, a price
            competition or for the execution of a contract, and even in these
            cases only insofar as this is permitted to us on the basis of a
            consent given by you or in accordance with the applicable legal
            provisions (further information on this can be found below in the
            section &#34;Legal basis of processing&#34;).
          </p>
        </li>

        <li>
          <p>
            You are neither legally nor contractually obligated to share your
            personal information. However, certain features of our websites may
            depend on the sharing or personal information. If you do not provide
            your personal information in such cases, you may not be able to use
            those features, or they may be available with limited functionality.
          </p>
        </li>
      </ol>

      <p className="impr-subheader">3. Purpose of use</p>
      <ol type="a">
        <li>
          <p>
            We use the personal information collected during your visit to any
            of our websites to make using them as convenient as possible for you
            and to protect our IT systems against attacks and other unlawful
            activities.
          </p>
        </li>

        <li>
          <p>
            If you share additional information with us &ndash; for example, by
            filling out a registration form, contact form, survey, contest entry
            or to execute a contract with you &ndash; we will use that
            information for the designated purposes, purposes of customer
            management and &ndash; if required &ndash; for purposes of
            processing and billing and business transactions within the required
            scope in each instance.
          </p>
        </li>
      </ol>

      <p className="impr-subheader">
        4. Transfer of Personal Information to Third Parties; Social Plugins;
        Use of Service Providers
      </p>
      <ol type="a">
        <li>
          <p>
            Our websites may also contain an offer of third parties. If you
            click on such an offer, we transfer data to the respective provider
            to the required extent (e.g. information that you have found this
            offer with us and, if applicable, further information that you have
            already provided on our websites for this purpose). &nbsp;
          </p>
        </li>
        <br />
        <p>
          <Link to={COOKIE_STATEMENT_ROUTE}>Cookie Policy</Link>
        </p>
        <li>
          <p>
            We also use qualified service providers (IT service providers) to
            operate, optimize and secure our websites. We only pass on personal
            data to the latter insofar as this is necessary for the provision
            and use of the website and its functionalities, for the pursuit of
            legitimate interests or insofar as you have consented there to (see
            Section 8). Data may be transmitted to recipients outside the
            European Economic Area; please refer to section 12 below.
          </p>
        </li>
      </ol>

      <p className="impr-subheader">
        5. Evaluation of use data (&#34;tracking&#34;)
      </p>
      <ol className="impr-list-none">
        <li>
          <p>5.1 General</p>
          <p>
            We want the content of our websites to match your preferences as
            closely as possible, thereby improving what we offer you. To
            recognize use preferences and particularly popular areas of the
            websites, we use the following tracking technologies: Google
            Analytics.
          </p>
          <p>
            Google Analytics is a web analytics service provided by Google, Inc.
            (&ldquo;Google&rdquo;). Google Analytics uses &ldquo;cookies&rdquo;,
            which are text files placed on your computer, to help the website
            analyze how users use the site. The information generated by the
            cookie about your use of the website will be transmitted to and
            stored by Google on servers in the United States.
          </p>
          <p>
            In case IP-anonymization is activated on this website, your IP
            address will be truncated within the area of Member States of the
            European Union or other parties to the Agreement on the European
            Economic Area. Only in exceptional cases the whole IP address will
            be first transferred to a Google server in the USA and truncated
            there. The IP-anonymization is active on this website.
          </p>
          <p>
            Google will use this information on behalf of the operator of this
            website for the purpose of evaluating your use of the website,
            compiling reports on website activity for website operators and
            providing them other services relating to website activity and
            internet usage.
          </p>
          <p>
            The IP-address, that your browser conveys within the scope of Google
            Analytics, will not be associated with any other data held by
            Google.
          </p>
          <p>
            &nbsp;For legal reasons, the use of tracking technologies is
            sometimes only possible with your express consent (so-called opt-In
            &ndash; see section 5.2); in the other cases you can object to the
            use of such technologies if you wish (so-called opt-out &ndash; see
            section 5.3.).
          </p>
        </li>
        <br />
        <br />
        <br />
        <li>
          <p>5.2 Use of Google Analytics &ndash; Opt-in</p>
          <p>
            We only use Google Analytics with your express consent, which you
            can grant by clicking on the &#34;Agree&#34; button in the so-called
            Cookie Information Layer (&#34;Opt-in&#34;). We store this consent
            in a cookie on your device so that you are not asked for consent
            again each time you visit our websites, and for legal reasons, also
            on our servers with the IP address and a time stamp; we delete this
            information or restrict its processing if you withdraw your consent
            or 6 months at the latest after your last visit to our websites.
          </p>
          <p>
            Should you change your mind at any time, you can withdraw your
            consent by clicking on the following link:
          </p>
          <p>Withdraw consent to Google Analytics</p>
          <p>
            To delete cookies inserted with your consent when visiting our
            websites after your consent to Google Analytics is withdrawn, please
            visit the Google websites; at the time when these data protection
            notes were compiled, the following link can be used for this:
          </p>
          <p>
            <a
              href="https://adssettings.google.de/anonymous"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://adssettings.google.de/anonymous
            </a>
          </p>
          <br />
        </li>
        <br />
        <br />
        <br />
        <li>
          <p>5.3 Use of technologies by other providers &ndash; Opt-out</p>

          <p>
            If you do not wish us to use the above tracking to collect and
            analyze information about your visit to our websites, you can
            permanently object to the practice (&#34;opt out&#34;) at any time.
          </p>
          <p>
            We will comply with your objection by placing an opt-out cookie in
            your browser. This cookie will only indicate that you have opted
            out. Please note that for technical reasons, an opt-out cookie
            affects only the browser in which it has been installed. If you
            delete the cookie or use a different browser or device, you will
            need to opt out again.
          </p>
          <p>
            The following are the respective opt-out options for the individual
            technologies:
          </p>
          <p>
            Google Analytics:{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout?hl=de"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://tools.google.com/dlpage/gaoptout?hl=de
            </a>
          </p>

          <p>
            You can manage and deactivate the use of cookies and
            interest-related information by third parties at the following
            website:
          </p>
          <p>
            <a
              href="https://www.youronlinechoices.com/uk/your-ad-choicesh"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.youronlinechoices.com/uk/your-ad-choicesh
            </a>
          </p>
        </li>
        <br />
        <br />
        <br />
        <li>
          <p>5.4 Data transmission to so-called third countries</p>
          <p>
            When using tracking and (re) targeting technologies, data may be
            transmitted to recipients outside the European Economic Area; please
            see section12 below.
          </p>
        </li>
      </ol>
      <br />
      <br />
      <br />

      <p className="impr-subheader">6. Security</p>
      <ol className="impr-list-none">
        <li>
          <p>
            We take technical and organizational security measures in order to
            protect your information managed by us from being tampered with,
            lost, destroyed or accessed by authorized individuals. We are
            continuously improving our security measures in line with
            technological advancements.
          </p>
        </li>
      </ol>
      <br />

      <p className="impr-subheader">7. Legal Foundations for Processing</p>
      <ol type="a">
        <li>
          <p>
            If you have given us your consent to process your personal
            information, then that is the legal foundation for processing it
            (Art.&nbsp;6, para.&nbsp;1, letter a, of the EU&#39;s General Data
            Protection Regulation, or GDPR).
          </p>
        </li>

        <br />

        <li>
          <p>
            6, para. 1, letter b, of the GDPR is the legal basis for processing
            personal information for the purpose of entering into a contact or
            performing a contract with you.
          </p>
        </li>

        <br />

        <li>
          <p>
            If processing your personal information is required to fulfill our
            legal obligations (e.g. data retention), we are authorized to do so
            by Art.&nbsp;6, para. 2, letter c, of the GDPR.
          </p>
        </li>

        <br />

        <li>
          <p>
            Furthermore, we process personal information for purposes of
            protecting our legitimate interests as well as the interests of
            third parties in accordance with Art.&nbsp;6, para. 1, letter f of
            the GDPR. Examples of such legitimate interests include maintaining
            the functionality of our IT systems as well as the (direct)
            marketing of our products and services and those of third parties
            and the legally required documentation of business contacts. As part
            of the consideration of interests required in each case, we take
            into account various aspects, in particular the type of personal
            information, the purpose of processing, the circumstances of
            processing and your interest in the confidentiality of your personal
            information.
          </p>
        </li>
      </ol>
      <br />
      <p className="impr-subheader">8. Deleting your personal data</p>
      <ol type="a" className="impr-list-none">
        <li>
          <p>
            Your IP address and the name of your Internet service provider,
            which we store for security reasons, are deleted after seven days.
            Moreover, we delete your personal information as soon as the purpose
            for which it was collected and processed has been fulfilled. Beyond
            this time period, data storage only takes place to the extent made
            necessary by the legislation, regulations or other legal provisions
            to which we are subject in the EU or by legal provisions in
            third-party countries if these have an appropriate level of data
            protection. Should it not be possible to delete data in individual
            cases, the relevant personal data are flagged to restrict their
            further processing.
          </p>
        </li>
      </ol>
      <br />
      <p className="impr-subheader">9. Rights of the Data Subject</p>
      <ol type="a">
        <li>
          <p>
            As a data subject affected by data processing, you have the right to
            information (Section 15 GDPR), Correction (Section 16 GDPR),
            Deletion (Section 17 GDPR), Restricted processing (Section18 GDPR)
            and Data Transferability (Section 20 GDPR).
          </p>
        </li>
        <br />
        <li>
          <p>
            If you have consented to the processing of your personal information
            by us, you have the right to revoke your consent at any time. Your
            revocation does not affect the legality of the processing of your
            personal information that took place before your consent was
            revoked. It also has no effect on the continued processing of the
            information on another legal basis, such as to fulfill legal
            obligations (see section titled &#34;Legal Foundation of
            Processing&#34;).
          </p>
        </li>
        <br />
        <li style={{ border: "1px solid grey" }}>
          <p>
            <u>
              Right to object <br />
              For reasons relating to your particular situation, you have the
              right to file an objection at any time to the processing of
              personal data pertaining to you that is collected under Section 6
              Clause (1e) GDPR (data processing in the public interest) or
              Section 6 Clause 1 f) GDPR (data processing on the basis of a
              balance of interests). If you file an objection, we will continue
              to process your personal data only if we can document mandatory,
              legitimate reasons that outweigh your interests, rights and
              freedoms, or if processing is for the assertion, exercise or
              defense of legal claims.
            </u>
          </p>
        </li>
        <br />
        <li>
          <p>
            We ask you to address your claims or declarations to the following
            contact address if possible: data.protection@ampcontact.com
          </p>
        </li>
        <br />
        <li>
          <p>
            If you believe that the processing of your personal data violates
            legal requirements, you have the right to lodge a complaint with a
            competent data protection supervisory authority (Art. 77 GDPR).
          </p>
        </li>
      </ol>
      <br />

      <p className="impr-subheader">10. Newsletter</p>
      <ol className="impr-list-none">
        <li>
          <p>
            If you subscribe to a newsletter offered on our website, the
            information provided during registration for the newsletter will be
            used solely for the purpose of mailing the newsletter unless you
            consent to its use for additional purposes. You may cancel the
            subscription at any time by using the option to unsubscribe
            contained in the newsletter.
          </p>
        </li>
      </ol>
      <br />
      <p className="impr-subheader">
        11. <span>{`${BRAND_NAME}`}</span>&#39;s Central Registration Service
      </p>
      <ol className="impr-list-none">
        <li>
          <p>
            With the Central Registration Service offered by{" "}
            <span>{`${BRAND_NAME}`}</span>, you can sign up for every website
            and application belonging to the{" "}
            <span>{`${BRAND_NAME_TERTIARY}`}</span> and its brands that are
            connected to the service. The applicable terms of use contain
            specific data protection provisions. Those terms of use can be found
            on the registration pages of affiliated websites and applications.
          </p>
        </li>
      </ol>
      <br />

      <p className="impr-subheader">
        12. Data transmission to recipients outside the European Economic Area
      </p>
      <ol type="a">
        <li>
          <p>
            When using service providers (see section 4. d.), tracking and
            (re-)targeting (see section 5), personal data may be provided to
            recipients in countries outside the European Union (&#34;EU&#34;),
            Iceland, Liechtenstein and Norway (= European Economic Area) are
            transferred and processed there, in particular USA.
          </p>
        </li>
        <li>
          <p>
            In the following countries, from the EU&#39;s point of view, there
            is an adequate level of personal data protection (so-called
            &#34;adequacy&#34;), in compliance with EU standards: Andorra,
            Argentina, Canada (limited), Faroe Islands, Guernsey, Israel, Isle
            of Man, Japan, Jersey, New Zealand, Switzerland, Uruguay. We agree
            with recipients in other countries on the use of EU standard
            contractual clauses, binding corporate regulations or EU-U. S. or
            Swiss-U. S. Privacy Shield to create an &#34;adequate level of
            protection&#34; according to legal requirements. For more
            information, please use the contact details given in section 9.d.
            above.
          </p>
        </li>
      </ol>

      <br />
      <p className="impr-subheader">13. Cookies</p>
      <ol className="impr-list-none">
        <li>
          <p>
            You can find information about the cookies we use and their
            functions in our Cookie Policy.
          </p>
        </li>
        <br />
        <li>
          <p>
            <Link to={COOKIE_STATEMENT_ROUTE}>Cookie Policy</Link>
          </p>
        </li>
      </ol>
      <br />
      <p>Last update: May 2019</p>
      <br />
    </div>
  );
};
