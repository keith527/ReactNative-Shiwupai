/**
* Description:
* Created by Yacheng Lee on 2017-08-02 08:57:04
* @flow
*/
import {useStrict, action, observable, computed, runInAction} from 'mobx';
import {get} from '../util/HttpTool';

useStrict(true);

export default class FeedBaseStore{

    @observable feedList = [];
    @observable errorMsg = '';
    @observable page = 1;
    @observable isRefreshing = false;
    @observable isNoMore = true;

    constructor(categoryId){
        this.categoryId = categoryId;
        this.fetchFeedList();
    }

    /**
     * 一个异步请求
     * 分页查询，并且可以刷新
     * 1、第一次请求 2、刷新 3、加载更多
     * 从page考虑，第一次请求page=1，加载更多的时候，page != 1,所以如果page != 1 的时候需要刷新则需要将page重新赋值为1。
     */
    @action
    fetchFeedList = async() => {
        try{
            if(this.isRefreshing) this.page = 1;
            const url = 'http://food.boohee.com/fb/v1/feeds/category_feed';

            const params = {
                page:this.page,
                category:this.categoryId,
                per: 10
            };

            const responseData = await get({url, params, timeout:30}).then(res => res.json());
            const {page, total_pages, feeds} = responseData;

            runInAction(() => {
                this.isRefreshing = false;
                this.errorMsg = '';
                this.isNoMore = page >= total_pages;

                if(this.page == 1){
                    this.feedList.replace(feeds);
                }else {

                    this.feedList.splice(this.feedList.length, 0, ...feeds);
                }

            })

        }catch(error){
            if(error.msg) {
                this.errorMsg = error.msg;
            }else {
                this.errorMsg = error;
            }
        }
    }

    @computed
    get isFetching() {
        return this.feedList.length === 0 && this.errorMsg === '';
    }

    @computed
    get isLoadMore() {
        return this.page != 0;
    }


}









