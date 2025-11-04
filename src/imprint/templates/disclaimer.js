import React from "react";

export const DisclaimerContent = () => {
  return (
    <div className="impr">
      <h3 className="impr-subheader impr-mrgn-top">amp GmbH</h3>
      <p>
        Sandstra&szlig;e 33
        <br /> D-80335 Munich
        <br /> GERMANY
        <br /> Tel +49 89 23 23 89 90
        <br /> Fax +49 89 23 23 89 91
        <br /> mail (at)&nbsp;ampcontact.com
        <br />{" "}
        <a href={`${window.location.origin}/#/search`}>
          {`${window.location.origin}/#/search`}
        </a>
        <br /> <br /> Registered office: Munich
        <br /> Amtsgericht M&uuml;nchen, HRB 177139
        <br /> USt-IdNr. DE263004941
      </p>
      <p>
        <span className="impr-subheader">Managing Director:</span>
        <br /> Michele Arnese
      </p>
      <p>
        <br /> <span className="impr-subheader">Disclaimer</span>
        <br /> We point out that the information on this site can contain
        technical inaccuracies or typographical errors.
        <br /> We reserve the right to change or update the information on this
        site at any time without prior notice.
      </p>
      <p>
        All works or portions thereof posted on our website, such as texts,
        files, compositions and images, are protected by copyright or by the
        Design Act.
        <br /> Any further publication, duplication, propagation or other uses
        &ndash; even in the form of excerpts &ndash; requires the prior written
        consent of amp GmbH.
      </p>
      <p>
        <span className="impr-subheader">Data protection</span>
        <br /> When collecting, using and processing personal data, amp GmbH
        observes the applicable regulations for data protection.
        <br /> If there is any possibility to input personal data (e-mail
        address, name, address, etc.) within the scope of this website, it is
        voluntary.
        <br /> The personal data you make available are only used internally to
        answer your inquiry, process your orders or give you access to certain
        information.
        <br /> Upon written request, we will inform you of all data on your
        person filed with us.
        <br /> Moreover, you have the right to correct, delete and/or block this
        data at any time.
      </p>
      <p>
        <span className="impr-subheader">Hyperlinks</span>
        <br /> This website may contain hyperlinks to websites of third parties.
        Links from this website to websites of third parties are opened in a
        separate browser window and only made availability for reasons of
        user-friendliness.
        <br /> amp GmbH dissociates itself expressly from the content of these
        websites and does not adopt the external websites and their content as
        its own. amp GmbH is not responsible for the content of external
        websites.
        <br /> Users make use of them at their own risk.
      </p>
    </div>
  );
};
