import React from 'react';
import _ from 'lodash';
import {WebView} from 'react-native-webview';

const NewPage = ({route}) => {
	const {newItem} = route.params;

	const displayHtml = `
        <html>
            <head>
            <link rel="Stylesheet" href="http://fap.fpt.edu.vn/fu.css" type="text/css">
            <style type="text/css">
                .style1 {font-weight: bold;}
                body {
                    padding: 1.5rem;
                    font-size: 30px;
                    line-height: initial;
                }
                .fon31 {
                    font-size: 2.7rem;
                    line-height: initial;
                }
                #ctl00_mainContent_divOther {
                    display: none;
                }
            </style>
            </head>
            <body>${_.unescape(newItem.content) || ''}</body>
        </html>
    `;
	return <WebView source={{html: displayHtml}} />;
};

export default NewPage;
