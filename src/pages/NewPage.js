import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import {WebView} from 'react-native-webview';

import PageLoadingComponent from '../components/PageLoadingComponent';

import {fetchNewsDetails} from '../state/data';

const NewPage = ({route}) => {
	const dispatch = useDispatch();
	const {newItem} = route.params;

	const {html, loading} = useSelector((state) =>
		_.find(_.get(state, 'data.news'), {id: newItem.id}),
	);

	useEffect(() => {
		dispatch(fetchNewsDetails(newItem));
	}, [newItem, dispatch]);

	if (loading) {
		return <PageLoadingComponent />;
	}

	const displayHtml = `
        <html>
            <head>
            <link rel="Stylesheet" href="http://fap.fpt.edu.vn/fu.css" type="text/css">
            <style type="text/css">
                .style1 {font-weight: bold;}
                body {
                    padding: 1.4rem;
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
            <body>${html || ''}</body>
        </html>
    `;
	return <WebView source={{html: displayHtml}} />;
};

export default NewPage;
