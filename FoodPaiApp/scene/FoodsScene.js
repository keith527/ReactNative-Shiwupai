/**
* Description: 食物小类内容列表
* Created by Yacheng Lee on 2017-08-01 08:57:43
* @flow
*/
import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image, Animated,
    ScrollView,ListView, ActivityIndicator} from 'react-native';
import Header from '../component/Header';
import {reaction, action, useStrict} from 'mobx';
import {observer} from 'mobx-react/native';
import FoodsStore from '../store/FoodsStore';
import LoadMoreFooter from '../component/LoadMoreFooter';
import Loading from '../component/Loading';
import {Actions} from 'react-native-router-flux';

useStrict(true);

const KIND = 'group';
const CATEGORY = {
    id: 1,
    name: "主食类",
    image_url: "http://up.boohee.cn/house/u/food_library/category/1_v1.png",
    sub_category_count: 3,
    sub_categories: [
        {
            id: 13,
            name: "包装谷薯",
            image_url: null
        },
        {
            id: 11,
            name: "天然谷薯",
            image_url: null
        },
        {
            id: 12,
            name: "谷薯制品",
            image_url: null
        }
    ],
    description: null
}

/**
 * 目标功能：1. 动画显示，关闭子类别列表  2. 选择不同类别需要重新访问网络 3. 传递过来的类别需要加上一个"全部"的类
 * 接收参数：categoryID， subCategories， onSelectSubCategory
 * 组件状态：isShow， subCategories：[]（这个可以不设置为state吗？）
 *
 */
class FoodSubCategoryHandleView extends Component {
    static propTypes = {
        sub_categories: React.PropTypes.object,
        categoryID: React.PropTypes.number,
        onSelectSubCategory: React.PropTypes.func
    }
    //
    // state = {
    //     isShow:false,
    //     subCategories:[]
    // }

    heightValue = new Animated.Value(0);


    //TODO ：没有执行？？？
    componentWillReceiveProps(nextProps) {

        const {subCategories, categoryID} = nextProps;
        this.setState({
            subCategories :[{id:categoryID, name:'全部'}, ...subCategories]
        });
    }

    constructor(props){
        super(props);
        const {subCategories, categoryID} = props;
        this.state={
            subCategories :[{id:categoryID, name:'全部'}, ...subCategories],
            isShow:false,
        };
    }
    _show = () => {
        this.setState({isShow:true}, () => {
                Animated.spring(this.heightValue, {
                    toValue:1,
                    duration:250
                }).start()
        }
        )
    }

    _close = () => {
        Animated.spring(this.heightValue,{
            toValue:0,
            duration:250
        }).start(() => this.setState({isShow:false}));
    }

    _renderSubcategory = (subCategory, key) => {
        const {name} = subCategory;
        const {subCategories} = this.state;
        const isLastItem = key == subCategories.length - 1

        return(
            <TouchableOpacity
                key={`${subCategory.name}-${key}`}
                activeOpacity={0.75}
                onPress={() => this._onPressItem(subCategory)}
                style={[styles.subcategoryItem, isLastItem&&{borderBottomWidth:0}]}
                >
                <Text style={{color:'white', fontSize:13}}>{name}</Text>
            </TouchableOpacity>
        );
    }

    /**
     * 目标功能，将当前点击的sub_id，传递给回调函数onSelectsubCategory
     * @private
     */
    _onPressItem = (subCategory) => {
        const {onSelectSubCategory} = this.props;
        Animated.spring(this.heightValue, {
            toValue:0,
            duration:250
        }).start(() => {
            onSelectSubCategory && onSelectSubCategory(subCategory);
            this.setState({isShow:false})
        })


    }

    render(){

        if(! this.state.isShow) return null;
        const {subCategories} = this.state;
        const top = this.heightValue.interpolate({
            inputRange:[0,1],
            outputRange:[-34 * subCategories.length, 5]
        })

        return(
            <View style={{zIndex:2, position:'absolute', top: gScreen.navBarHeight, left:0 }}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.subcategoryWrapper}
                    onPress={this._close}>
                    <Animated.View
                        style={[styles.subcategoryAnimatedWrapper, {top}]}>
                        {subCategories.map(this._renderSubcategory)}
                    </Animated.View>
                </TouchableOpacity>
            </View>
        );
    }



}

class FoodSiftHandleView extends Component {
    static propTypes = {
        onChangeOrderAsc: React.PropTypes.func,
        onSelectSortType: React.PropTypes.func,
        sortTypes: React.PropTypes.array,
    }

    orderByModalYValue = new Animated.Value(0);

    state = {
        isShow:false,
        currentType:'常见',
        orderAsc:1
    }


    _show = () => {
        this.setState({isShow:true}, () => {
            Animated.timing(this.orderByModalYValue, {
                toValue:1,
                duration:250
            }).start()
        })
    }

    _close = () => {
        Animated.timing(this.orderByModalYValue, {
            toValue:0,
            duration:250,
        }).start(() => this.setState({isShow:false}))
    }

    _onPressSortItem = (type) => {
        const {onSelectSortType} = this.props;

        this.setState({
            currentType:type.name
        }, () => {
            onSelectSortType && onSelectSortType(type);
            this._close();
        });

    }

    _onChangeOrderAsc = ()=> {
        const {orderAsc} = this.state;
        const {onChangeOrderAsc} = this.props;
        this.setState({orderAsc:orderAsc == 0 ? 1 : 0},
            () => onChangeOrderAsc && onChangeOrderAsc(orderAsc)
        )
    }

    _renderSortTypeCell = (type, key) => {

        const {currentType} = this.state;
        const {sortTypes} = this.props;
        const isLast = sortTypes.length -1 == key;

        const titleStyle = [{fontSize:13, color:'#333'}];
        if(currentType == type.name) titleStyle.push({color:'rgb(253,84,94)'});
        return(
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => this._onPressSortItem(type)}
                key={`${type.name}-${key}`}
                style={[styles.sortTypeItem, isLast && {width:gScreen.width}]}>
                <Text style={titleStyle}>{type.name}</Text>
            </TouchableOpacity>
        )
    }

    render(){

        const {isShow, currentType, orderAsc} = this.state;
        const {sortTypes} = this.props;

        const rotate =isShow? '180deg':'0deg'
        const backgroundColor = this.orderByModalYValue.interpolate({
            inputRange:[0 ,1],
            outputRange:['transparent', 'rgba(1,1,1,0.3)']
        });

         const contentHeight = gScreen.height * 0.4;
        const contentYPosition =this.orderByModalYValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-contentHeight, 0]
        });

        const orderAscStr = orderAsc==1?'由高到低':'由低到高';
        const orderAscSrc = orderAsc ==1? require('../resource/ic_food_ordering_down.png'):require('../resource/ic_food_ordering_up.png');

        return(
            <View style={{zIndex:1}}>
                <View style={[styles.siftWrapper, {zIndex:1}, isShow && {borderBottomWidth: StyleSheet.hairlineWidth}]}>
                    <TouchableOpacity
                        activeOpacity={0.75}
                        style={styles.siftCell}
                        onPress={this._show}>
                        <Text style={{fontSize:13, marginRight:5}}>{currentType}</Text>
                        <Image style={{width:16, height:16, transform:[{rotate}]}}
                            source={require('../resource/ic_food_ordering.png')}/>
                    </TouchableOpacity>
                    {currentType == '常见'?
                        <View style={styles.siftCell}/>:
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.siftCell}
                            onPress={this._onChangeOrderAsc}>
                            <Text style={{color: 'rgb(253,84,94)', fontSize: 13}}>{orderAscStr}</Text>
                            <Image source={orderAscSrc} style={{width:16, height:18}}/>
                        </TouchableOpacity>
                    }
                </View>
                {isShow &&
                <Animated.View style={[styles.animatedCover, {backgroundColor}]}>
                    <TouchableOpacity activeOpacity={1} style={{flex:1}} onPress={this._close}>
                        <Animated.View style={[styles.animatedContent, {top:contentYPosition, height: contentHeight}]}>
                            {sortTypes.length == 0?
                                <LoadingProgressView/>:
                                <ScrollView
                                    style={{backgroundColor:'#fff'}}
                                    contentContainerStyle={{flexDirection:'row', flexWrap:'wrap'}}
                                >
                                    {sortTypes.map(this._renderSortTypeCell)}
                                </ScrollView>
                            }
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>
               }
            </View>
        )
    }
}

/**
 * ListView 的item组件
 * 目标功能：1. 展示foods列表 2. 根据不同的排序类别显示不同的副标题
 * 需要参数：1、food的全部信息，2、排序类别 3、点击响应回调方法
 */
class FoodItem extends Component {
    static propTypes = {
        food: React.PropTypes.object,
        sortCode: React.PropTypes.string,
        onPress: React.PropTypes.func,
    }

    _onPress = () =>{
        const {onPress, food} = this.props;
        onPress && onPress(food);
    }

    render(){
        const {food, sortCode} = this.props;
        let lightStyle = [styles.healthLight];
        if(food.health_light == 2){
            lightStyle.push({backgroundColor:gColors.healthYellow})
        }else if(food.health_light == 3){
            lightStyle.push({backgroundColor:gColors.healthRed})
        }

        const defaultImg = require('../resource/img_default_food_thumbnail.png');
        const imgSrc = food.thumb_image_url ? {uri:food.thumb_image_url}:defaultImg;

        return(
            <TouchableOpacity
                activeOpacity={0.75}
                style={styles.foodItem}
                onPress={this._onPress}>

                <Image style={{width:40, height:40,borderRadius:4, marginHorizontal:10}}
                       source={imgSrc}
                        defaultSource={defaultImg}/>
                <View style={styles.foodNameWrapper}>
                    <View style={{justifyContent:'center', width: gScreen.width-60-30}}>
                        <Text style={{color:'#666', marginBottom:5}} numberOfLines={1}>{food.name}</Text>
                        <Text style={{color:'red', fontSize: 13}}>
                            {food[sortCode]}
                            <Text style={{color:'#666'}}>{` ${gSortTypeUnitMapper[sortCode]}/${food.weight}克`}</Text>
                        </Text>
                    </View>
                    <View style={lightStyle}/>
                </View>
            </TouchableOpacity>
        );
    }

}

const LoadingProgressView = ({style}) => {
    return(
        <View style={[styles.loadingProgress, style]}>
            <ActivityIndicator/>
        </View>
    );
}

@observer
export default class FoodsScene extends Component{

    state = {
        dataSource: new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 != row2,
        }),
        sortCode:'calory',
        subCategory:'全部',
        sortTypes:[]

    }

    foodsStore = new FoodsStore(this.props.kind, this.props.category.id);

    componentDidMount() {

       this.dispose = reaction(
           () => [
               this.foodsStore.page,
               this.foodsStore.orderBy,
               this.foodsStore.orderAsc,
               this.foodsStore.sub_value,
           ],
           () => this.foodsStore.fetchFoods()
       )

        this._fetchSortTypes();

    }

    _fetchSortTypes = async() => {
        const URL = 'http://food.boohee.com/fb/v1/foods/sort_types';
        try{
            const result = await fetch(URL).then(response => {
                if(response.status == 200) return response.json();
                return null;
            });
            this.setState({sortTypes: result.types})
        } catch(error) {
            alert(`[Foods] fetch sort types error: ${error}`)
        }
    }

    componentWillUnMount() {
        this.dispose();
    }

    _onBack = () => {
        const {onResetBarStyle, navigator} = this.props;
        Actions.pop()
        onResetBarStyle && onResetBarStyle()
    }

    _onPressRightItem = () => {
        this.subCategory._show();
    }

    _renderRightItem = () => {

        return(
            <TouchableOpacity
                    activeOpacity={0.75}
                    style={{flexDirection:'row', alignItems:'center'}}
                    onPress={this._onPressRightItem}>
                <Text style={{color: '#666', fontSize:13}}>{this.state.subCategory}</Text>
                <Image source={require('../resource/ic_bullet_down_gray.png')}
                        style={{width:13, height:16}} resizeMode='contain'/>
            </TouchableOpacity>
        );
    }

    @action
    _onSelectSubCategory = (subCategory) => {
        const {category:{id}} = this.props;
        this.foodsStore.sub_value = id == subCategory.id ?'':subCategory.id;
        this.setState({
            subCategory:subCategory.name
        })
    }

    @action
    _onSelectSortType = (type) => {
        this.setState({sortCode:type.code});
        this.foodsStore.orderBy = type.index;
    }

    @action
    _onChangeOrderAsc = orderAsc => {
        this.foodsStore.orderAsc = orderAsc;
    }

    @action
    _onLoadMore = () =>{
        if (!this.foodsStore.isNoMore) {
            this.foodsStore.page++
        }
    }

    _renderFooter = () => {

        const {foods} = this.foodsStore;
        if(foods.length == 0) return null;

        return(
            <LoadMoreFooter isNoMore={this.foodsStore.isNoMore}/>
        );
    }

    _onPressFoodItem = (food) => {
        alert(JSON.stringify(food))
    }

    _renderRow = (food) => {
        const {sortCode} = this.state;
        return <FoodItem food={food} onPress={this._onPressFoodItem} sortCode={sortCode}/>
    }

    render(){
        const {category:{id, name, sub_categories}} = this.props;

        const {foods, isFetching} = this.foodsStore;
        const {dataSource, sortTypes} = this.state;

        return(
            <View style={{flex:1, backgroundColor:gColors.background}}>
                <Header
                    title={name}
                    style={{zIndex: 3}}
                    onBack={this._onBack}
                    renderRightItem={this._renderRightItem}/>
                {sub_categories.length>0 &&
                    <FoodSubCategoryHandleView
                        ref={r => this.subCategory = r}
                        subCategories={sub_categories}
                        categoryID = {id}
                        onSelectSubCategory={this._onSelectSubCategory}/>
                }
                <FoodSiftHandleView
                    sortTypes = {sortTypes}
                    onSelectSortType = {this._onSelectSortType}
                    onChangeOrderAsc = {this._onChangeOrderAsc}/>
                <ListView
                    style={{backgroundColor: 'rgba(220, 220, 220, 0.2)'}}
                    showsVerticalScrollIndicator={false}
                    dataSource={dataSource.cloneWithRows(foods.slice(0))}
                    enableEmptySections={true}
                    renderRow={this._renderRow}
                    renderFooter={this._renderFooter}
                    onEndReached={this._onLoadMore}
                    onEndReachedThreshold={30}/>
               <Loading isShow={isFetching}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    subcategoryWrapper:{
        width:gScreen.width,
        height:gScreen.height - gScreen.navBarHeight,
        zIndex:1,
       // flexDirection: 'row',
       //  paddingHorizontal: 10,
       //  justifyContent: 'flex-end',
    },

    subcategoryAnimatedWrapper:{
        backgroundColor:'rgba(83, 83, 83, 0.85)',
        position:'absolute',
        right:10,
        borderRadius:4,
    },
    subcategoryItem:{
        height:34,
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor: 'rgba(255,255,255,0.6)',
        borderBottomWidth:StyleSheet.hairlineWidth,
        paddingHorizontal:20

    },
    foodItem:{
        height:60,
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10
    },
    foodNameWrapper:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgb(194,194,198)',
        height:60,
        width: gScreen.width - 60,
        paddingRight:10
    },
    healthLight:{
        width:10,
        height:10,
        borderRadius:5,
        backgroundColor: gColors.healthGreen,
        marginRight: 0,
    },
    loadingProgress:{
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    siftWrapper:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'white',
        height:44,
        paddingHorizontal:10,
        borderBottomColor: gColors.border

    },
    siftCell:{
        height:44,
        flexDirection:'row',
        alignItems:'center'
    },

    animatedCover:{
        position:'absolute',
        top:44,
        left:0,
        right:0,
        height:gScreen.height - gScreen.navBarHeight - 44
    },
    animatedContent:{
        position:'absolute',
        left:0,
        right:0
    },
    sortTypeItem :{
            height:40,
            width: gScreen.width/3,
            justifyContent:'center',
            paddingLeft:10,
            borderBottomWidth:StyleSheet.hairlineWidth,
            borderBottomColor:gColors.border,
            borderBottomColor:gColors.border,
    }


});