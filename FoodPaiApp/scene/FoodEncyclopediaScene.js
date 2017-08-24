/**
* Description: 食物百科页面
* Created by Yacheng Lee on 2017-07-31 09:09:20
* @flow
*/
import React, {Component} from 'react';
import {StyleSheet, View, Text,ScrollView,Image, TouchableOpacity,ImageBackground} from 'react-native';
import {observer,inject} from 'mobx-react/native';
import '../constant/GlobalConstant';
import FoodEncyclopediaStore from '../store/FoodEncyclopediaStore';
import Loading from '../component/Loading';
import NetInfoDecorator from '../component/NetInfoDecorator';
import {Navigator} from 'react-native-deprecated-custom-components'
import {Actions} from 'react-native-router-flux';

const HeaderView = ({searchAction}) => {

    return(
        <ImageBackground style={styles.headerContainer} source={require('../resource/img_home_bg.png')}>
            <Image style={styles.headerLogo} source={require('../resource/ic_head_logo.png')} resizeMode='contain'/>
            <View style={{alignItems: 'center'}}>
                <Text style={{color:'white', fontSize:15,marginBottom:15}}>查 询 食 物 信 息</Text>
                <TouchableOpacity
                    style={styles.headerSearchContainer}
                    activeOpacity={0.75}
                    onPress={searchAction}>
                    <Image style={{width:20, height:20,marginHorizontal: 5}} source={require('../resource/ic_home_search.png')}/>
                    <Text style={{color: 'rgba(222, 113, 56, 0.8)', fontSize:15}}>请输入食物名称</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const HandleItem = ({imageName, title, onPress}) => {
    return(
       <TouchableOpacity
            activeOpacity={0.75}
            style={{alignItems:'center', justifyContent:'space-between', paddingVertical:5,flex:1, height:60}}
            onPress={onPress}>
            <Image style={{width:28, height:28}} source={imageName}/>
           <Text style={{fontSize:13, color:'gray'}}>{title}</Text>
       </TouchableOpacity>
    );
}

const FoodHandleView = ({handleAction}) => {
    return(
        <View style={styles.foodHandleContainer}>
            <HandleItem imageName={require('../resource/ic_home_analyse.png')}
                         title="饮食分析" onPress={() => handleAction('饮食分析')}/>
            <View style={styles.line}/>
            <HandleItem imageName={require('../resource/ic_search_compare.png')}
                        title="搜索对比" onPress={() => handleAction('搜索对比')}/>
            <View style={styles.line}/>
            <HandleItem imageName={require('../resource/ic_scan_compare.png')}
                        title="扫码对比" onPress={() => handleAction('扫码对比')}/>
        </View>
    );
}

const FoodCategoryView = ({foodCategory, onPress}) => {
    const {kind, categories} = foodCategory;
    let title = '食物分类';
    if(kind === 'brand'){
        title = '热门品牌';
    }else if (kind === 'restaurant'){
        title = '连锁餐厅';
    }

    return(
        <View style={{backgroundColor:'white', overflow:'hidden', marginTop: 10,}}>
            <View style={styles.groupHeader}>
                <Text style={{color:'gray'}}>{title}</Text>
                <View style={{backgroundColor:'#f5f5f5', height:14,width:gScreen.width-16*2}}>
                    <Image style={{width:gScreen.width-16*2, height:14}}
                           source={require('../resource/img_home_list_bg.png')}/>
                </View>
            </View>
            <View style={styles.categoryContainer}>
                {categories.map(category => {
                   return(
                       <TouchableOpacity
                            key={category.id}
                            activeOpacity={0.75}
                            onPress={() => onPress(kind,category)}
                            style={{width:(gScreen.width-2*16)/3, alignItems:'center', height:65, marginBottom:25}}>
                           <Image
                               resizeMode='contain'
                                style={{width:40, height:40}}
                                source={{uri: category.image_url}}/>
                           <Text style={{color:'gray', fontSize: 12, marginTop:5}}>{category.name}</Text>
                       </TouchableOpacity>
                   );
                })}
            </View>
        </View>
    );
}

@NetInfoDecorator
@inject('account','app')
@observer//这个要写在最下面
export default class FoodEncyclopediaScene extends Component{

    foodEncyclopediaStore = new FoodEncyclopediaStore();

    constructor(){
        super();
    }

    componentWillReact() {
        const {errorMsg} = this.foodEncyclopediaStore;
        errorMsg && console.error(errorMsg);

    }

    componentDidMount() {
        const {isNoResult} = this.foodEncyclopediaStore;

        if(isNoResult){
            this.foodEncyclopediaStore.fetchCategoryList();
        }

    }


    componentWillReceiveProps(nextProps) {
        const {isNoResult} = this.foodEncyclopediaStore;

        if(isNoResult){
            this.foodEncyclopediaStore.fetchCategoryList();
        }

    }


    searchAction = () => alert('search');
    resetBarStyle = () => this.props.app.updateBarStyle('light-content')

    foodHandleAction = (handletitle) => {
        alert(handletitle);
    }

    _onPressCategoryItem = (kind, category) => {

        const {app, navigator} = this.props;
        app.updateBarStyle('default');
        Actions.foodInfo({
                kind,
                category,
                onResetBarStyle: this.resetBarStyle

        })
    }

    render(){

        const {isFetching, foodCategoryList} = this.foodEncyclopediaStore;
        const {isConnected} = this.props;
        return(
            <View style={{flex:1}}>
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustContentInsets={true}
                    removeClippedSubviews
                    style={{width: gScreen.width, height: gScreen.height}}
                    contentContainerStyle={{alignItems: 'center', backgroundColor: '#f5f5f5', paddingBottom: 10}}>
                    <HeaderView searchAction={this.searchAction}/>
                    <FoodHandleView handleAction={this.foodHandleAction}/>
                    {isConnected?
                        foodCategoryList.map(foodCategory => {
                            return(
                                <FoodCategoryView
                                    key={`FoodCategory-${foodCategory.kind}`}
                                    foodCategory={foodCategory}
                                    onPress={this._onPressCategoryItem}/>
                            )
                        }):null
                    }
                </ScrollView>
                <Loading isShow={isFetching}/>
            </View>

        );
    }

}
const styles = StyleSheet.create({
   headerContainer:{
       width:gScreen.width,
       height:220,
       alignItems:'center',
       justifyContent:'space-between',
       paddingTop:__IOS__? 22+15:15,
       paddingBottom:28,
       paddingHorizontal: 16,
       backgroundColor: 'rgba(1,1,1,0)',
       overflow: 'hidden'

   },
    headerLogo:{
        width:66,
        height:24
    },
    headerSearchContainer:{
        width:gScreen.width - 16*2,
        height:50,
        backgroundColor:'white',
        borderRadius:4,
        flexDirection:'row',
        alignItems:'center'
    },
    foodHandleContainer:{
        width:gScreen.width - 16*2,
        height:60,
        backgroundColor:'white',
        flexDirection:'row',
        marginHorizontal:16,
        marginVertical:10,
        shadowColor:'gray',
        alignItems:'center',
        shadowOpacity:0.3,
        shadowOffset: {width:1, height:-1},
        borderRadius:2,
    },
    line: {
        height: 50,
        width: 0.5,
        backgroundColor: '#d9d9d9'
    },
    groupHeader:{
        height:40,
        alignItems:'center',
        justifyContent:'center'
    },
    categoryContainer:{
       width:gScreen.width - 2*16,
        backgroundColor:'white',
        flexDirection:'row',
        flexWrap:'wrap'
    },
});