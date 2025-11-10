import React, { Component } from 'react';
import socialIcon1 from '../img/social1.svg';
import socialIcon2 from '../img/social2.svg';
import socialIcon3 from '../img/social3.svg';

class Footer extends Component {
  render() {
    const companyName = this.props.companyName;

    return (
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__links">
            <a className="footer__logo">{companyName}</a>
            <ul className="footer__links_ul">
              <li><p className="footer__link_active">Join {companyName}</p></li>
              <li><a className="footer__link">Our Plan</a></li>
              <li><a className="footer__link">Employers</a></li>
              <li><a className="footer__link">Brokers</a></li>
              <li><a className="footer__link">Members</a></li>
            </ul>
            <ul className="footer__links_ul">
              <li><p className="footer__link_active">Company</p></li>
              <li><a className="footer__link">About</a></li>
              <li><a className="footer__link">Blog</a></li>
              <li><a className="footer__link">Careers</a></li>
              <li><a className="footer__link">Contact</a></li>
            </ul>
            <div className="footer__inputs">
              <div className="footer__inputs_title">Get the latest</div>
              <div className="footer__inputs_subtitle">Sign up to receive benefits news and insights in your inbox once a month.</div>
              <div className="footer_input">
                <input type="text" placeholder="Email*" />
                <button>→</button>
              </div>
              <div className="social_links">
                <a><img src={socialIcon1} alt="Social Link 1" /></a>
                <a><img src={socialIcon2} alt="Social Link 2" /></a>
                <a><img src={socialIcon3} alt="Social Link 3" /></a>
              </div>
            </div>
          </div>
          <div className="footer__text">
            <p className="footer__text_1">
              Brella is a limited benefit policy; it is not a substitute for health insurance. The information provided on this website is illustrative only. A complete description of benefits, limitations, and exclusions are provided in your certificate of Insurance and applicable Riders. For a summary of limitations and exclusions, see our FAQ. Payout values listed do not guarantee an amount to be paid for listed conditions. Product not available in all states. All coverage is subject to the terms and conditions of the master group policy.
              <br/><br/>
              Brella is underwritten by Greenhouse Life Insurance Company (NAIC 80055). Form No. PFSB11-TX
              <br/><br/>
              Reach us by mail at 2093 Philadelphia Pike #2496, Claymont, DE 19703 and by phone at (844) 987-1070
            </p>
            <div className="footer__bottom_link">
              <p className="footer__text_2">© 2021 {companyName} Insurance Inc. All Rights Reserved.</p>
              <p className="footer__link_licenze">
                <a>Privacy</a>
                <a>Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;