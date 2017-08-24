
import React, {Component} from 'react';
import {StyleSheet, View, Text,AppRegistry, } from 'react-native';
import {observable, action,useStrict, computed, runInAction} from 'mobx';
import {observer} from 'mobx-react/native'
import {get} from './HttpTool';
useStrict(true);


class FoodEncyclopediaStore {

    @observable foodCategoryList = []
    @observable errorMsg = ''

    @action
    fetchCategoryList = async() => {
        try {
            const url = 'http://food.boohee.com/fb/v1/categories/list'
            const responseData = await get({url, timeout: 30}).then(res => res.json())
            alert('success');
            // action只能包裹异步的函数体，如果要在返回函数中改变state 则需要使用到runInAction
            runInAction(() => {
                this.foodCategoryList.replace(responseData.group)
                this.errorMsg = ''
            })
        } catch (error) {
            if (error.msg) {
                this.errorMsg = error.msg
            } else {
                this.errorMsg = error
            }
        }
    }

    @computed
    get isFetching() {
        return this.foodCategoryList.length === 0 && this.errorMsg === ''
    }

    @computed
    get isNoResult() {
        return this.foodCategoryList.length === 0
    }
}

class Counter {
    @observable num=0;

    constructor(num){
        this.num = num;
    }

    @action
    add = () => {
        this.num++;
    }

}

@observer
export class Demo extends Component{

    food = new FoodEncyclopediaStore();

    componentDidMount() {
        this.food.fetchCategoryList();
    }


    render(){
        const {foodCategoryList} = this.food;
        return(
            <View style={{backgroundColor:'orange', paddingTop:25}}>
               <Text>123</Text>
               <Text>{foodCategoryList.length}</Text>

            </View>
        );
    }
}


AppRegistry.registerComponent('ShiwuPai', () => Demo)