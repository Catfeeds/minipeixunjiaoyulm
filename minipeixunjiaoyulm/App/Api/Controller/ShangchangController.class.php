<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class ShangchangController extends PublicController {

	//***************************
	//  获取所有商场的数据
	//***************************
    public function index(){
    	//查询条件
    	//根据店铺分类id查询
    	$condition = array();
    	$condition['status']=1;
    	$cid = intval($_REQUEST['cid']);
    	if ($cid) {
    		$condition['cid']=intval($cid);
    	}

    	//根据店铺名称查询
    	$keyword = trim($_REQUEST['keyword']);
    	if ($keyword) {
    		$condition['name']=array('LIKE','%'.$keyword.'%');
    	}

        $cityid = intval($_REQUEST['cityid']);
        if ($cityid>0) {
            $condition['city']=intval($cityid);
        }

    	//获取页面显示条数
    	$page = intval($_REQUEST['page']);
    	if (!$page) {
    		$page = 1;
    	}
        $limit = intval($page*8)-8;

    	//获取所有的商家数据
    	$store_list = M('shangchang')->where($condition)->order('sort desc,type desc')->field('id,cid,name,logo,per_price,grade,intro')->limit($limit.',8')->select();
    	foreach ($store_list as $k => $v) {
    		$store_list[$k]['logo'] = __DATAURL__.$v['logo'];
            $store_list[$k]['catname'] = M('sccat')->where('id='.intval($v['cid']))->getField('name');
    	}

    	echo json_encode(array('status'=>1,'list'=>$store_list));
    	exit();
    }

    //***************************
    //  商家列表获取更多
    //***************************
    public function get_more(){
        //查询条件
        //根据店铺分类id查询
        $condition = array();
        $condition['status']=1;
        $cid = intval($_REQUEST['cid']);
        if ($cid) {
            $condition['cid']=intval($cid);
        }

        //根据店铺名称查询
        $keyword = trim($_REQUEST['keyword']);
        if ($keyword) {
            $condition['name']=array('LIKE','%'.$keyword.'%');
        }

        //获取页面显示条数
        $page = intval($_REQUEST['page']);
        if (!$page) {
            $page = 1;
        }
        $limit = intval($page*6)-6;

        //获取所有的商家数据
        $store_list = M('shangchang')->where($condition)->order('sort desc,type desc')->field('id,name,uname,logo,tel,sheng,city,quyu')->limit($limit.',6')->select();
        foreach ($store_list as $k => $v) {
            $store_list[$k]['sheng'] = M('china_city')->where('id='.intval($v['sheng']))->getField('name');
            $store_list[$k]['city'] = M('china_city')->where('id='.intval($v['city']))->getField('name');
            $store_list[$k]['quyu'] = M('china_city')->where('id='.intval($v['quyu']))->getField('name');
            $store_list[$k]['logo'] = __DATAURL__.$v['logo'];
            $pro_list = M('product')->where('del=0 AND pro_type=1 AND is_down=0 AND shop_id='.intval($v['id']))->field('id,photo_x,price_yh')->limit(4)->select();
            foreach ($pro_list as $key => $val) {
                $pro_list[$key]['photo_x'] = __DATAURL__.$val['photo_x'];
            }
            $store_list[$k]['pro_list'] = $pro_list;
        }

        echo json_encode(array('status'=>1,'store_list'=>$store_list));
        exit();
    }

    //***************************
	//  获取商铺详情信息接口
	//***************************
    public function shop_details(){

        $shop_id = intval($_REQUEST['shop_id']);
        $shop_info = M('shangchang')->where('id='.intval($shop_id))->field('id,name,logo,vip_char,content,intro')->find();
        if (!$shop_info) {
            echo json_encode(array('status'=>0,'err'=>'没有找到商铺信息.'));
            exit();
        }

        //图片处理
        $shop_info['logo']=__DATAURL__.$shop_info['logo'];
        if ($shop_info['vip_char']) {
            $shop_info['vip_char']=__DATAURL__.$shop_info['vip_char'];
        }else{
            $shop_info['vip_char']=__PUBLICURL__.'home/images/shop.jpg';
        }

        $content = str_replace('/miniweddingcybl/Data/', __DATAURL__, $shop_info['content']);
        $shop_info['content']=html_entity_decode($content, ENT_QUOTES ,'utf-8');
        $shu = mt_rand()/mt_getrandmax() * (5);
        $shop_info['grade'] = sprintf('%.1f', (float)$shu);
        //销量
        $shop_info['salenum'] = intval(M('product')->where('shop_id='.intval($shop_id))->getField('COUNT(*)'));
        //收藏
        $shop_info['collet'] = intval(M('shangchang_sc')->where('shop_id='.intval($shop_id))->getField("COUNT(*)"));
        //全部商品数量
        $shop_info['all'] = intval(M('product')->where('shop_id='.intval($shop_id).' AND del=0 AND is_down=0')->getField('COUNT(*)'));
        //推荐商品数量
        $shop_info['tj'] = intval(M('product')->where('shop_id='.intval($shop_id).' AND del=0 AND is_down=0 AND type=1')->getField('COUNT(*)'));
        //上新数量
        $shop_info['newpro'] = intval(M('product')->where('shop_id='.intval($shop_id).' AND del=0 AND is_down=0 AND addtime>'.intval(time()-604800))->getField('COUNT(*)'));

        //获取 所有商品 的8个商品
        $pro_list = M('product')->where('shop_id='.intval($shop_id).' AND del=0 AND is_down=0')->order('addtime desc,sort desc')->field('id,name,intro,price_yh,photo_x,shiyong,is_show,is_hot,is_sale')->limit(8)->select();
        foreach ($pro_list as $k => $v) {
            $pro_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
        }

        //获取 推荐商品 的8个商品
        $tj_list = M('product')->where('shop_id='.intval($shop_id).' AND del=0 AND is_down=0 AND type=1')->order('addtime desc,sort desc')->field('id,name,intro,price_yh,photo_x,shiyong')->limit(8)->select();
        foreach ($tj_list as $k => $v) {
            $tj_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
        }

        //获取 上新 的8个商品
        $new_list = M('product')->where('shop_id='.intval($shop_id).' AND del=0 AND is_down=0 AND addtime>'.intval(time()-604800))->order('id asc,sort desc')->field('id,name,intro,price_yh,photo_x,shiyong')->limit(8)->select();
        foreach ($new_list as $k => $v) {
            $new_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
        }

        echo json_encode(array('status'=>1,'shop_info'=>$shop_info,'pro'=>$pro_list,'tj_list'=>$tj_list,'list'=>$new_list));
        exit();
    }


	//***************************
	//  会员店铺收藏接口
	//***************************
	public function shop_collect(){
		$uid = intval($_REQUEST['uid']);
		$shop_id = intval($_REQUEST['shop_id']);
		if (!$uid || !$shop_id) {
			echo json_encode(array('status'=>0,'err'=>'系统错误，请稍后再试.'));
			exit();
		}

		$check = M('shangchang_sc')->where('uid='.intval($uid).' AND shop_id='.intval($shop_id))->getField('id');
		if ($check) {
			echo json_encode(array('status'=>1,'succ'=>'您已收藏该店铺.'));
			exit();
		}
		$data = array();
		$data['uid'] = intval($uid);
		$data['shop_id'] = intval($shop_id);
		$res = M('shangchang_sc')->add($data);
		if ($res) {
			echo json_encode(array('status'=>1,'succ'=>'收藏成功！'));
			exit();
		}else{
			echo json_encode(array('status'=>0,'err'=>'网络错误..'));
			exit();
		}
	}

	//***************************
	//  公共获取省市区名称方法
	//***************************
	public function get_city_name($id){
		$cityModel = M('china_city');
		$city_name = $cityModel->where('id='.intval($id))->getField('name');
		return $city_name;
	}
}