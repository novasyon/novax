import React, { Component } from "react";
import ProfileScreen from "./ProfileScreen.js";
import ResetPasswordScreen from "./ResetPasswordScreen.js";
import { StackNavigator } from "react-navigation";
export default (
  
  ProfileNav = StackNavigator({
  Profile: { screen: ProfileScreen},
  ResetPassword: { screen: ResetPasswordScreen}
}));