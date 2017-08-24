/**
* Description:
* Created by Yacheng Lee on 2017-08-01 09:12:22
* @flow
*/
import {observable, action, runInAction} from 'mobx';

class FoodsStore {
    //与请求的参数相关
    @observable kind = '';
    @observable categoryID = 1;
    @observable orderBy = 1;
    @observable orderAsc = 0;
    @observable sub_value = '';
    @observable page = 1;

    //请求结果
    @observable foods = [];

    //与网络请求状态相关
    @observable isFetching = false;
    @observable isNoMore = true;


    constructor(kind, categoryID){
        this.kind = kind;
        this.categoryID = categoryID;
        this.isFetching = true;
        this.fetchFoods();
    }

    @action
    fetchFoods = async() => {
       try {
           //this.isFetching = true;
           const {foods, isNoMore} = await this._fetchDataFromUrl();
           runInAction(() => { //可以理解为让自线程运行在主线程中
               this.isFetching = false;
               this.isNoMore = isNoMore;
               if(this.page == 1){
                   this.foods.replace(foods);
               } else {
                   this.foods.splice(this.foods.length, 0, ...foods);
               }
           })

       } catch(error) {
            this.isFetching = false;
        }
    }

    _fetchDataFromUrl = () => {

        return new Promise((resolve, reject) => {
            const URL = `http://food.boohee.com/fb/v1/foods?kind=${this.kind}&value=${this.categoryID}&order_by=${this.orderBy}&page=${this.page}&order_asc=${this.orderAsc}&sub_value=${this.sub_value}`;

            fetch(URL).then(response => {
                if(response.status == 200) return response.json();
                return null;
            }).then(responseData => {
                if(responseData){
                    const {foods, page,total_pages} = responseData;
                    resolve({foods, isNoMore:page >= total_pages});
                }else{
                    reject('请求错误')
                }
            }).catch(error => {
                reject('网络错误！')
            })
        })

    }


}

export default FoodsStore;