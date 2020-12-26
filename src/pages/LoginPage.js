import React, {useEffect, useState} from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Alert,
	ActivityIndicator,
} from 'react-native';
import {Text, Input, Button, Icon, CheckBox} from 'react-native-elements';
import {Dropdown} from 'react-native-material-dropdown-v2';

import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import _ from 'lodash';

import {login} from '../state/auth';
import {getAllCampus} from '../state/data';
import sharedStyles from '../styles';
import AboutComponent from '../components/AboutComponent';
import locale from '../locale';

const LoginPage = () => {
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);
	const [loading, setLoading] = useState(true);
	const [campuses, setCampuses] = useState([]);

	useEffect(() => {
		getAllCampus()
			.then((data) => {
				setCampuses(
					data.map((item) => ({
						id: item.CampusCode,
						value: item.CampusName,
					})),
				);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	function handleFormSubmit(values, {setSubmitting}) {
		if (!values.password || !values.userName) {
			Alert.alert(locale.error, locale.studentNoAndPasswordErr);
			setSubmitting(false);
			return;
		}
		dispatch(
			login({
				password: values.password,
				userName: values.userName,
				campusCode: campuses[values.campusIndex].id,
				rememberMe: values.rememberMe,
			}),
		).then((response) => {
			setSubmitting(false);
			const errorMessage = _.get(response, 'error.message');
			if (errorMessage) {
				Alert.alert(locale.error, errorMessage);
			}
		});
	}

	function renderForm(formikBag) {
		const {
			values,
			handleBlur,
			handleChange,
			setFieldValue,
			errors,
			handleSubmit,
			isSubmitting,
		} = formikBag;
		const campName =
			(typeof values.campusIndex === 'number' &&
				_.get(campuses, `[${values.campusIndex}].value`)) ||
			locale.selectCampus;
		return (
			<View>
				<Dropdown
					data={campuses}
					dropdownPosition={1}
					fontSize={20}
					onChangeText={(v, index) => {
						setFieldValue('campusIndex', index);
					}}
					renderBase={() => (
						<View style={{marginBottom: 16}}>
							<View style={sharedStyles.dropdownContentContainer}>
								<Icon type="evilicon" name="location" size={30} />
								<Text style={{flex: 1, fontSize: 16}}>{campName}</Text>
								<Icon type="antdesign" name="down" size={18} color="#666" />
							</View>
							<View style={sharedStyles.dropdownDivider} />
							{errors.campusIndex && (
								<Text style={{color: 'red'}}>{errors.campusIndex}</Text>
							)}
						</View>
					)}
				/>
				<Input
					placeholder={locale.userName}
					leftIcon={{type: 'antdesign', name: 'user'}}
					value={values.userName}
					onChangeText={handleChange('userName')}
					onBlur={handleBlur('userName')}
					errorStyle={{color: 'red'}}
					errorMessage={errors.userName}
					autoCapitalize="none"
				/>

				<Input
					placeholder={locale.password}
					leftIcon={{type: 'antdesign', name: 'key'}}
					secureTextEntry={true}
					value={values.password}
					onChangeText={handleChange('password')}
					onBlur={handleBlur('password')}
					errorStyle={{color: 'red'}}
					errorMessage={errors.password}
				/>
				<CheckBox
					title={locale.rememberMe}
					checked={values.rememberMe}
					onPress={() => {
						setFieldValue('rememberMe', !values.rememberMe);
					}}
					containerStyle={styles.checkboxContainer}
					textStyle={styles.checkbox}
				/>

				<View style={styles.loginContainer}>
					<Button
						loading={isSubmitting}
						title={locale.login}
						onPress={handleSubmit}
					/>
				</View>
			</View>
		);
	}

	const renderFormContainer = () => {
		if (loading) {
			return (
				<View style={[styles.loadingContainer]}>
					<ActivityIndicator />
				</View>
			);
		}
		return (
			<Formik
				initialValues={{
					campusIndex: auth.campusCode
						? _.findIndex(campuses, {id: auth.campusCode})
						: 0,
					userName: auth.userName,
					password: auth.password,
					rememberMe: auth.rememberMe,
				}}
				onSubmit={handleFormSubmit}>
				{renderForm}
			</Formik>
		);
	};

	return (
		<ScrollView
			contentContainerStyle={[styles.container]}
			keyboardShouldPersistTaps="handled">
			{renderFormContainer()}

			<AboutComponent style={{marginTop: 22}} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f5f5f5',
		padding: 16,
		paddingTop: 30,
	},
	checkboxContainer: {
		backgroundColor: 'transparent',
		borderWidth: 0,
		paddingHorizontal: 0,
		paddingTop: 0,
		marginTop: 0,
	},
	checkbox: {
		fontWeight: '500',
		color: '#333',
		marginLeft: 4,
	},
	loginContainer: {
		marginTop: 16,
	},
	loadingContainer: {
		minHeight: 200,
		justifyContent: 'center',
	},
});

export default LoginPage;
