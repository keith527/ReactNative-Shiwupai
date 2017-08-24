/**
* Description:
* Created by Xiaocheng Zuo on 2017-03-05 15:14:08
* @flow
*/

import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class TabIcon extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Icon
                    color={this.props.selected ? '#3e9ce9' : '#999999'}
                    name={this.props.iconName}
                    size={25}
                />
                <Text style={[styles.title, { color: this.props.selected ? '#3e9ce9' : '#999999' }]}>
                    {this.props.title}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    title: {
        fontSize: 14
    }
});
