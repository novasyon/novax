
import React from "react";
import { AsyncStorage, AppRegistry, Image, StyleSheet, StatusBar, View } from "react-native";
import {
    Button,
    Text,
    Header,
    Container,
    List,
    Body,
    Title,
    ListItem,
    Content,
    Left, Right
} from "native-base";

import { Icon } from 'react-native-elements';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import _ from 'lodash';
import Collapsible from 'react-native-collapsible';


export default class MenuItem extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            hideItems: true
        }
    }

    toggle() {

        if (this.state.hideItems) {
            this.setState({ hideItems: false })
        } else {
            this.setState({ hideItems: true });
        }
    }

    render() {

        //console.log("Menu Item");

        let menu = this.props.menu;
        let currentStyle = styles.list_show;
        let iconName = 'chevron-down';

        if (this.state.hideItems) {
            currentStyle = styles.list_hide;
            iconName = 'chevron-right';
        }



        return (
            <View>
                <View>
                    <ListItem
                        style={{ borderBottomWidth: 0 }}
                        button
                    >
                        <View>
                            <Button transparent onPress={
                                () => this.props.route(menu)
                            } >
                                <Text style={{ fontWeight: 'bold', color: '#fff' }}

                                >{menu.menuTitle}</Text>
                            </Button>
                        </View>
                        <Right>
                            <Button iconRight light transparent onPress={() => this.toggle()}>
                                <Icon name={iconName} type='entypo' color='#fff' />
                            </Button>
                        </Right>
                    </ListItem>
                </View>
                <View style={currentStyle}>
                    <List
                        dataArray={menu.menuItems}
                        renderRow={
                            data => {
                                //console.log("icon:", data.icon, ",type:", data.type);
                                return (
                                    <ListItem
                                        icon
                                        style={{ borderBottomWidth: 0 }}
                                        button
                                        onPress={
                                            () =>
                                                this.props.route(data)
                                        }
                                    >
                                        <Left><Icon name={data.icon} type={data.type} /></Left>
                                        <Body><Text>{data.title}</Text></Body>
                                    </ListItem>
                                )
                            }
                        }
                    />

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    list_hide: {
        backgroundColor: '#fff',
        width: 0,
        height: 0
    },

    list_show: {
        backgroundColor: '#fff',
    }
});

