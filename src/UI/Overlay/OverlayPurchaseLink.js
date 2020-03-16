import React from 'react';

export default function OverlayPurchaseLink({ href, color, text }) {
    return (
        <div className="overlay-content-item">
            <div className="overlay-content-icon">
                <a
                    target="_blank"
                    className="purchase-link"
                    href={href}
                >
                    <svg fill={color} viewBox="0 0 180 100">
                        <path d="M49.999,85.744c-19.708,0-35.742-16.036-35.742-35.745s16.034-35.743,35.742-35.743  c19.71,0,35.746,16.034,35.746,35.743S69.709,85.744,49.999,85.744z M49.999,15.825c-18.844,0-34.172,15.331-34.172,34.174  c0,18.845,15.328,34.175,34.172,34.175c18.845,0,34.175-15.33,34.175-34.175C84.174,31.156,68.844,15.825,49.999,15.825z" />
                        <circle cx="36.135" cy="40.684" r="3.907" />
                        <path d="M68.014,40.684c0,2.157-1.748,3.906-3.906,3.906c-2.16,0-3.906-1.749-3.906-3.906s1.746-3.907,3.906-3.907  C66.266,36.776,68.014,38.526,68.014,40.684z" />
                        <path d="M49.999,72.704c-9.901,0-18.589-6.337-21.615-15.768l1.496-0.479c2.815,8.778,10.901,14.677,20.119,14.677  c9.22,0,17.306-5.898,20.121-14.677l1.498,0.479C68.59,66.367,59.902,72.704,49.999,72.704z" />
                    </svg>

                </a>
            </div>
            <div className="overlay-content-item-text">
                <a
                    className="purchase-link"
                    target="_blank"
                    href={href}
                    style={{
                        color: color
                    }}
                > {text}
            </a>
            </div>
        </div>
    );
}