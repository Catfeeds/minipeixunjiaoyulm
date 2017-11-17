<?php
namespace Api\Controller;
use Think\Controller;
class IndexController extends PublicController {
	//***************************
	//  首页数据接口
	//***************************
    public function index(){
    	//如果缓存首页没有数据，那么就读取数据库
    	/***********获取首页顶部轮播图************/
    	$ggtop=M('guanggao')->where('position=1')->order('sort asc,id desc')->field('id,photo,type,action')->limit(8)->select();
		foreach ($ggtop as $k => $v) {
			$ggtop[$k]['photo']=__DATAURL__.$v['photo'];
		}
    	/***********获取首页顶部轮播图 end************/

        /***********获取首页中部轮播图************/
        $ggmiddle=M('guanggao')->where('position=2')->order('sort asc,id desc')->field('id,photo,type,action')->limit(8)->select();
        foreach ($ggmiddle as $k => $v) {
            $ggmiddle[$k]['photo']=__DATAURL__.$v['photo'];
        }
        /***********获取首页中部轮播图 end************/

        //======================
        //首页推荐品牌 20个
        //======================
        $brand = M('brand')->where('1=1')->field('id,name,photo')->limit(20)->select();
        foreach ($brand as $k => $v) {
            $brand[$k]['photo'] = __DATAURL__.$v['photo'];
        }

        //======================
        //首页培训课程
        //======================
        $course = M('course')->where('del=0')->order('id desc')->field('id,title,intro,photo')->limit(8)->select();
        foreach ($course as $k => $v) {
            $course[$k]['photo'] = __DATAURL__.$v['photo'];
        }

        //======================
        //首页最新展会
        //======================
        $exhibition = M('exhibition')->where('del=0')->order('id desc')->field('id,title,intro,photo')->limit(8)->select();
        foreach ($exhibition as $k => $v) {
            $exhibition[$k]['photo'] = __DATAURL__.$v['photo'];
        }

    	//======================
    	//首页推荐产品
    	//======================
        $where = 'del=0 AND pro_type=1 AND type=1';
        $cityid = intval($_REQUEST['cityid']);
        if (!$cityid) {
            $cityid = 2292;
        }
        if ($cityid>0) {
            $shopId = M('shangchang')->where('status=1 AND city='.intval($cityid))->field('id')->select();
            if ($shopId) {
                $idArr = array();
                foreach ($shopId as $va) {
                    $idArr[] = intval($va['id']);
                }
                $where .= ' AND shop_id IN ('.implode($idArr, ',').')';
            }
        }

    	$pro_list = M('product')->where($where)->order('sort desc,id desc')->field('id,name,intro,photo_x,price_yh,price,shiyong')->limit(8)->select();
    	foreach ($pro_list as $k => $v) {
    		$pro_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
            $pro_list[$k]['price_yh'] = floatval($v['price_yh']);
            $pro_list[$k]['price'] = floatval($v['price']);
    	}

        //======================
        //首页分类 前五个
        //======================
        $indeximg = M('indeximg')->where('1=1')->order('sort asc')->limit(5)->select();
        foreach ($indeximg as $k => $v) {
           $indeximg[$k]['photo'] = __DATAURL__.$v['photo'];
        }

        //======================
        //首页分类 后五个
        //======================
        $prolastcat = M('indeximg')->where('1=1')->order('sort asc')->limit('5,5')->select();
        foreach ($prolastcat as $k => $v) {
           $prolastcat[$k]['photo'] = __DATAURL__.$v['photo'];
        }

        $imgs = __PUBLICURL__.'/home/images/2.jpg';

    	echo json_encode(array('ggtop'=>$ggtop,'ggmiddle'=>$ggmiddle,'imgs'=>$imgs,'procat'=>$indeximg,'prolist'=>$pro_list,'prolastcat'=>$prolastcat,'brand'=>$brand,'course'=>$course,'ex'=>$exhibition));
    	exit();
    }

    //***************************
    //  首页产品 分页
    //***************************
    public function getlist(){
        $page = intval($_REQUEST['page']);
        $limit = intval($page*8)-8;

        $pro_list = M('product')->where('del=0 AND pro_type=1 AND type=1')->order('sort desc,id desc')->field('id,name,photo_x,price_yh,price,shiyong')->limit($limit.',8')->select();
        foreach ($pro_list as $k => $v) {
            $pro_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
            $pro_list[$k]['price_yh'] = floatval($v['price_yh']);
            $pro_list[$k]['price'] = floatval($v['price']);
        }

        echo json_encode(array('prolist'=>$pro_list));
        exit();
    }

    //*************************************
    //  按照首字母排序获取所有城市列表 
    //*************************************
    public function getallcity(){
        $sId = M('china_city')->where('tid=0')->field('id')->select();
        $idArr = array();
        foreach ($sId as $v) {
            $idArr[] = intval($v['id']);
        }

        $yw = array("A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z");
        $list = array();$listss = array();
        foreach ($yw as $k => $v) {
            $listss['initial'] = $v;
            $listss['cityInfo'] = M('china_city')->where('head="'.$v.'" AND tid IN ('.implode($idArr,',').')')->order('head asc')->select();
            $list[] = $listss;
        }
        echo json_encode(array('list'=>$list));
        exit();
    }

    //******************************
    //  根据城市名字  获取城市ID
    //******************************
    public function getcityid(){
        $address = trim($_REQUEST['addr']);
        if (!$address) {
            echo json_encode(array('cityid'=>0));
            exit();
        }

        $sId = M('china_city')->where('tid=0')->field('id')->select();
        $idArr = array();
        foreach ($sId as $v) {
            $idArr[] = intval($v['id']);
        }

        $cityid = M('china_city')->where('name="'.$address.'" AND tid IN ('.implode($idArr,',').')')->getField('id');
        echo json_encode(array('cityid'=>intval($cityid)));
        exit();
    }

    //******************************
    //  保存用户点击过的 城市
    //******************************
    public function savecity(){
        $cityid = intval($_REQUEST['cityid']);
        $uid = intval($_REQUEST['uid']);
        if ($cityid) {
            $info = M('hotcity_log')->where('cityid='.intval($cityid))->find();
            $data = array();
            if ($info) {
                $data['click'] = intval($info['click'])+1;
                M('hotcity_log')->where('cityid='.intval($cityid))->save($data);
            }else{
                $data['click'] = 1;
                $data['cityid'] = $cityid;
                $data['cityname'] = M('china_city')->where('id='.intval($cityid))->getField('name');
                $data['addtime'] = time();
                M('hotcity_log')->add($data);
            }
        }
    }

    //******************************
    //  生活专区列表 数据
    //******************************
    public function life_list(){
        $condition = array();
        $cid = intval($_REQUEST['cid']);

        //获取所有分类
        $catlist = M('life_cat')->where('1=1')->order('id asc')->field('id,name')->select();
        if (!$cid) {
            $cid = intval($catlist[0]['id']);
        }

        if ($cid) {
            $condition['cid'] = intval($cid);
        }

        //获取页面显示条数
        $page = intval($_REQUEST['page']);
        if (!$page) {
            $page = 1;
        }
        $limit = intval($page*7)-7;

        //获取所有的商家数据
        $list = M('life')->where($condition)->order('addtime desc')->limit($limit.',7')->select();
        foreach ($list as $k => $v) {
            if ($v['img1']) {
                $list[$k]['img1'] = __DATAURL__.$v['img1'];
            }
            if ($v['img2']) {
                $list[$k]['img2'] = __DATAURL__.$v['img2'];
            }
            if ($v['img3']) {
                $list[$k]['img3'] = __DATAURL__.$v['img3'];
            }
            $list[$k]['img'] = __DATAURL__.$v['img1'];
            $list[$k]['addtime'] = date("Y-m-d H:i",$v['addtime']);
        }

        echo json_encode(array('list'=>$list,'clist'=>$catlist,'cid'=>$cid));
        exit();
    }

    public function ceshi(){
        $str = null;
        $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        $max = strlen($strPol)-1;

        for($i=0;$i<32;$i++){
            $str.=$strPol[rand(0,$max)];//rand($min,$max)生成介于min和max两个数之间的一个随机整数
        }

        echo $str;
    }

}