import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Input, Button, Icon, CheckBox} from 'react-native-elements';
import {Dropdown} from 'react-native-material-dropdown-v2';

import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import _ from 'lodash';

import {login} from '../state/auth';
import sharedStyles from '../styles';
import AboutComponent from '../components/AboutComponent';

const CAMPS = [
	{
		value: 'FU-Hoà Lạc',
		id: 3,
	},
	{
		value: 'FU-Hồ Chí Minh',
		id: 4,
	},
	{
		value: 'FU-Đà Nẵng',
		id: 5,
	},
	{
		value: 'FU-Cần Thơ',
		id: 6,
	},
];
const LoginPage = () => {
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth);

	function handleFormSubmit(values, {setSubmitting}) {
		if (!values.password || !values.studentNo) {
			Alert.alert('Lỗi', 'Nhập mật khẩu và mã sinh viên.');
			setSubmitting(false);
			return;
		}
		dispatch(
			login({
				password: values.password,
				studentNo: values.studentNo,
				campId: CAMPS[values.campIndex].id,
				rememberMe: values.rememberMe,
			}),
		).then((response) => {
			setSubmitting(false);
			const errorMessage = _.get(response, 'error.message');
			if (errorMessage) {
				Alert.alert('Lỗi', errorMessage);
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
			(typeof values.campIndex === 'number' &&
				_.get(CAMPS, `[${values.campIndex}].value`)) ||
			'Chọn cơ sở đào tạo';
		return (
			<View>
				<Dropdown
					data={CAMPS}
					dropdownPosition={1}
					fontSize={20}
					onChangeText={(v, index) => {
						setFieldValue('campIndex', index);
					}}
					renderBase={() => (
						<View style={{marginBottom: 16}}>
							<View style={sharedStyles.dropdownContentContainer}>
								<Icon type="evilicon" name="location" size={30} />
								<Text style={{flex: 1, fontSize: 16}}>{campName}</Text>
								<Icon type="antdesign" name="down" size={18} color="#666" />
							</View>
							<View style={sharedStyles.dropdownDivider} />
							{errors.campIndex && (
								<Text style={{color: 'red'}}>{errors.campIndex}</Text>
							)}
						</View>
					)}
				/>
				<Input
					placeholder="Mã số sinh viên +"
					leftIcon={{type: 'antdesign', name: 'user'}}
					value={values.studentNo}
					onChangeText={handleChange('studentNo')}
					onBlur={handleBlur('studentNo')}
					errorStyle={{color: 'red'}}
					errorMessage={errors.studentNo}
					autoCapitalize="none"
				/>

				<Input
					placeholder="Mật khẩu"
					leftIcon={{type: 'antdesign', name: 'key'}}
					secureTextEntry={true}
					value={values.password}
					onChangeText={handleChange('password')}
					onBlur={handleBlur('password')}
					errorStyle={{color: 'red'}}
					errorMessage={errors.password}
				/>
				<CheckBox
					title="Nhớ mật khẩu"
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
						title="Đăng nhập"
						onPress={handleSubmit}
					/>
				</View>
			</View>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={[styles.container]}
			keyboardShouldPersistTaps="handled">
			<Formik
				initialValues={{
					campIndex: auth.campId ? _.findIndex(CAMPS, {id: auth.campId}) : 0,
					studentNo: auth.studentNo,
					password: auth.password,
					rememberMe: auth.rememberMe,
				}}
				onSubmit={handleFormSubmit}>
				{renderForm}
			</Formik>

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
});

export default LoginPage;
