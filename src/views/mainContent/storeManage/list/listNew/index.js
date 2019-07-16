import React, {Component} from 'react'
import CPageNew from '@/components/CPageNew'
import CBaseComponent from '@/components/CBaseComponent'
import { storeManageListNewData} from './data'
import { getStoreCategoryList, getUserBusniessList} from "@/servers/commonApi";
import { insertStoreList, detailStoreList, editStoreList} from "@/servers/storeManageApi";
import {setPageNewItem, setPageNewValue, urlFormat} from "@/utils";
import _ from 'lodash'
import './index.scss'

@CBaseComponent
class StoreManageListNew extends Component{

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onSearch = _.throttle(this.getUserBusniessListData, 1000).bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getStoreCategoryListData = this.getStoreCategoryListData.bind(this);
    this.getUserBusniessListData = this.getUserBusniessListData.bind(this);
  }


  state = {
    data: storeManageListNewData
  }

  onChange(data){
    this.setState({
      data: setPageNewItem(this.state.data, data.data.id, 'value', data.value)
    })
  }

  onSearch(data){

  }


  onSubmit(data){
    if(data.data.avatarImg){
      let imgArr = [];
      data.data.avatarImg.forEach(item=>{
        imgArr.push({
          id: item.uid,
          url: item.url
        })
      });
      data.data.avatarImg = imgArr.length ? imgArr[0] : '';
    }
    let method = null;
    if(urlFormat(this.props.history.location.search).query.type === 'edit'){
      data.data.id = urlFormat(this.props.history.location.search).query.id;
      method = editStoreList;
    }else{
      method = insertStoreList
    }
    console.log(data,'datadatadatadata')
    method(data.data).then(res=>{
      this.props.history.goBack();
    }).catch(err=>{

    });
  }

  // 获取店铺详情
  getStoreDetailData(){
    let id = urlFormat(this.props.history.location.search).query.id;
    detailStoreList({id}).then(res=>{
      console.log(res,'resresresres')
      this.getUserBusniessListData(res.data.user.id);
      this.setState({
        data: setPageNewValue(this.state.data, res.data.userInfo)
      })
    }).catch(err=>{

    })
  }

  // 获取商家用户列表
  getUserBusniessListData(data){
    let search = {};
    if(typeof data === 'object'){
      search = {search: data.value};
    }else{
      search = {id: data}
    }
    getUserBusniessList({...search}).then(res=>{
      let data = res.data.list.slice(0,10);//只展示搜索到数据的前10条
      let list = [];
      data.forEach(item=>{
        list.push({
          value: item.id.toString(),
          name: item.name
        })
      });
      this.setState({
        data: setPageNewItem(this.state.data, 'user', 'options', list)
      })
    }).catch(err=>{

    })
  }

  // 获取商店类型列表数据
  getStoreCategoryListData(){
    getStoreCategoryList().then(res=>{
      let data = res.data.list;
      let list = [];
      data.forEach(item=>{
        list.push({
          value: item.id,
          name: item.name,
        })
      });
      this.setState({
        data: setPageNewItem(this.state.data, 'category', 'options', list)
      })
    }).catch(err=>{

    })
  }

  componentWillMount(){
    this.getStoreCategoryListData();
    if(urlFormat(this.props.history.location.search).query.type === 'edit'){
      this.getStoreDetailData();//如果是编辑的话获取详情数据
    }
  }

  render(){
    return (
      <div className='store-manage-list-new'>
        <CPageNew data={this.state.data} onChange={this.onChange} onSearch={this.onSearch} onSubmit={this.onSubmit}/>
      </div>
    )
  }
}

export default StoreManageListNew
