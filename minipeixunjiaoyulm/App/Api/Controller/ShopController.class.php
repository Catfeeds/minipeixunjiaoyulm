<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class ShopController extends PublicController {

	//***************************
	//  获取 体验店信息
	//***************************
    public function index(){

    	$uid = intval($_REQUEST['uid']);
    	$shop_info = M('exshop')->where('uid='.intval($uid))->find();
        if ($shop_info) {
            if ($shop_info['zheng']) {
                $shop_info['zheng']=__DATAURL__.$shop_info['zheng'];
            }
            if ($shop_info['fan']) {
                $shop_info['fan']=__DATAURL__.$shop_info['fan'];
            }
            if ($shop_info['yyzz']) {
                $shop_info['yyzz']=__DATAURL__.$shop_info['yyzz'];
            }
            if ($shop_info['dianmian']) {
                $shop_info['dianmian']=__DATAURL__.$shop_info['dianmian'];
            }
        }

    	echo json_encode(array('shop_info'=>$shop_info));
    	exit();
    }

    //***************************
    //  获取所有已审核体验店
    //***************************
    public function lists(){
        //查询条件
        //根据店铺分类id查询
        $condition = array();
        $condition['audit']=1;

        //根据店铺名称查询
        $keyword = trim($_REQUEST['keyword']);
        if ($keyword) {
            $condition['name']=array('LIKE','%'.$keyword.'%');
        }

        //获取所有的商家数据
        $list = M('exshop')->where($condition)->order('addtime desc')->limit(10)->select();
        foreach ($list as $k => $v) {
            if ($v['logo']) {
                $list[$k]['logo'] = __DATAURL__.$v['logo'];
            }else{
                $list[$k]['logo'] = '../../images/tiyan.png';
            }
            $list[$k]['addtime'] = date("Y-m-d H:i",$v['addtime']);
        }

        echo json_encode(array('list'=>$list));
        exit();
    }

    //***************************
    //  体验店 获取更多
    //***************************
    public function get_more(){
        //查询条件
        //根据店铺分类id查询
        $condition = array();
        $condition['audit']=1;

        //根据店铺名称查询
        $keyword = trim($_REQUEST['keyword']);
        if ($keyword) {
            $condition['name']=array('LIKE','%'.$keyword.'%');
        }

        //获取页面显示条数
        $page = intval($_REQUEST['page']);
        if (!$page) {
            $page = 2;
        }
        $limit = intval($page*10)-10;

        //获取所有的商家数据
        $list = M('exshop')->where($condition)->order('addtime desc')->limit($limit.',10')->select();
        foreach ($list as $k => $v) {
            if ($v['logo']) {
                $list[$k]['logo'] = __DATAURL__.$v['logo'];
            }else{
                $list[$k]['logo'] = '../../images/tiyan.png';
            }
            $list[$k]['addtime'] = date("Y-m-d H:i",$v['addtime']);
        }

        echo json_encode(array('list'=>$list));
        exit();
    }

	//***************************
	//  体验店提交审核
	//***************************
	public function audit(){
        $uid = intval($_REQUEST['uid']);
        if (!$uid) {
            echo json_encode(array('status'=>0,'err'=>'登录状态异常！'));
            exit();
        }

        $name = trim($_REQUEST['name']);
        $uname = trim($_REQUEST['uname']);
        $tel = trim($_REQUEST['tel']);
        $address = trim($_REQUEST['address']);
        if (!$name || !$tel) {
            echo json_encode(array('status'=>0,'err'=>'参数错误！'));
            exit();
        }

        $check_info = M('exshop')->where('uid='.intval($uid))->find();
        $data = array();
        $data['name'] = $name;
        $data['uname'] = $uname;
        $data['tel'] = $tel;
        $data['address'] = $address;
        $data['tjname'] = trim($_POST['tjname']);
        $data['tjtel'] = trim($_POST['tjtel']);
        $data['audit'] = 0;
        $data['reason'] = '无';
        $data['audit_time'] = time();
        if ($_REQUEST['zheng']) {
            $data['zheng'] = $_REQUEST['zheng'];
        }
        if ($_REQUEST['fan']) {
            $data['fan'] = $_REQUEST['fan'];
        }
        if ($_REQUEST['yyzz']) {
            $data['yyzz'] = $_REQUEST['yyzz'];
        }
        if ($_REQUEST['dianmian']) {
            $data['dianmian'] = $_REQUEST['dianmian'];
        }
        if ($check_info) {
            //修改资料，重新提交审核
            $res = M('exshop')->where('uid='.intval($uid))->save($data);

        }else{
            $data['addtime'] = time();
            $data['uid'] = intval($uid);
            $res = M('exshop')->add($data);
        }

        if ($res) {
            echo json_encode(array('status'=>1,'data'=>$data));
            exit();
        }else{
            echo json_encode(array('status'=>0,'err'=>'提交失败，请稍后再试！'));
            exit();
        }

	}

    //***************************
    //  体验店 上传LOGO
    //***************************
    public function uploadbl(){
        $uid = intval($_REQUEST['uid']);
        if (!$uid) {
            echo json_encode(array('status'=>0,'err'=>'登录状态异常！'));
            exit();
        }

        $info = $this->upload_images($_FILES['img'],array('jpg','png','jpeg'),"shop/logo/".date(Ymd));
        if(is_array($info)) {// 上传错误提示错误信息
            $url = 'UploadFiles/'.$info['savepath'].$info['savename'];
            //修改会员图片
            $check = M('exshop')->where('uid='.intval($uid))->find();
            if ($check) {
                $up = M('exshop')->where('uid='.intval($uid))->save(array('logo'=>$url,'audit'=>0));
            }else{
                $up = M('exshop')->add(array('logo'=>$url,'uid'=>$uid));
            }
            
            if ($up) {
                $xt = $check['logo'];
                if ($xt) {
                    $img_url = "Data/".$xt;
                    if(file_exists($img_url)) {
                        @unlink($img_url);
                    }
                }
                echo json_encode(array('status'=>1,'urls'=>__DATAURL__.$url));
                exit();
            }else{
                echo json_encode(array('status'=>0,'err'=>'图片保存失败！'));
                exit();
            }
        }else{
            echo json_encode(array('status'=>0,'err'=>$info));
            exit();
        }
    }

    //***************************
    //  体验店 验证电子券
    //***************************
    public function checkcode(){
        $ecode = trim($_REQUEST['voucode']);
        if (!$ecode) {
            echo json_encode(array('status'=>0,'err'=>'请输入电子券认证码！'));
            exit();
        }

        $check = M('exshop')->where('uid='.intval($_REQUEST['uid']).' AND audit=1')->find();
        if (!$check) {
            echo json_encode(array('status'=>0,'err'=>'非体验店不能进行认证！'));
            exit();
        }

        $check_info = M('coupons')->where('ecode="'.$ecode.'"')->find();
        if (!$check_info) {
            echo json_encode(array('status'=>0,'err'=>'认证码错误！err：'.$ecode));
            exit();
        }

        if (intval($check['id'])!=intval($check_info['shop_id']) && intval($check_info['shop_id'])>0) {
            echo json_encode(array('status'=>0,'err'=>'认证码与指定店铺不匹配！'));
            exit();
        }

        if (intval($check_info['state'])==0) {
            if (!intval($check_info['uid']) && !intval($check_info['order_id'])) {
                echo json_encode(array('status'=>0,'err'=>'认证码异常！err：'.__LINE__));
                exit();
            }
        }elseif (intval($check_info['state'])==1) {
            if (intval($check_info['offtime'])>0 && intval($check_info['offtime'])<time()) {
                M('coupons')->where('id='.intval($check_info['id']))->save(array('state'=>3));
                echo json_encode(array('status'=>0,'err'=>'认证码已过期！'));
                exit();
            }
        }elseif (intval($check_info['state'])==2) {
            echo json_encode(array('status'=>0,'err'=>'认证码已完成认证！'));
            exit();
        }elseif (intval($check_info['state'])==3) {
            echo json_encode(array('status'=>0,'err'=>'认证码已过期！err：'.__LINE__));
            exit();
        }else{
            echo json_encode(array('status'=>0,'err'=>'认证码异常！err：'.__LINE__));
            exit();
        }

        $up = array();
        $up['state'] = 2;
        $up['checktime'] = time();
        $res = M('coupons')->where('id='.intval($check_info['id']))->save($up);
        if ($res) {
            echo json_encode(array('status'=>1,'id'=>intval($check_info['id'])));
            exit();
        }else{
            echo json_encode(array('status'=>0,'err'=>'认证失败！err：fail'));
            exit(); 
        }
    }

    //***************************
    //  体验店 电子券信息
    //***************************
    public function codeinfo(){
        $code_id = intval($_REQUEST['code_id']);
        if (!$code_id) {
            echo json_encode(array('status'=>0,'err'=>'信息获取异常！'));
            exit();
        }

        $info = M('coupons')->where('id='.intval($code_id))->find();
        $info['gettime'] = date("Y-m-d H:i:s",$info['gettime']);
        $userinfo = M('user')->where('id='.intval($info['uid']))->field('photo,name')->find();
        if (!$userinfo) {
            echo json_encode(array('status'=>0,'err'=>'用户信息获取失败！'));
            exit();
        }

        $info['photo'] = $userinfo['photo'];
        $info['uname'] = $userinfo['name'];

        $orderinfo = M('order')->where('id='.intval($info['order_id']))->field('order_sn,amount')->find();
        if (!$orderinfo) {
            echo json_encode(array('status'=>0,'err'=>'用户消费信息获取失败！'));
            exit();
        }

        $info['order_sn'] = $orderinfo['order_sn'];
        $info['price'] = $orderinfo['amount'];

        echo json_encode(array('status'=>1,'info'=>$info));
        exit();
    }
        
    /*
    *
    * 图片上传的公共方法
    *  $file 文件数据流 $exts 文件类型 $path 子目录名称
    */
    public function upload_images($file,$exts,$path){
        $upload = new \Think\Upload();// 实例化上传类
        $upload->maxSize   =  3145728 ;// 设置附件上传大小3M
        $upload->exts      =  $exts;// 设置附件上传类型
        $upload->rootPath  =  './Data/UploadFiles/'; // 设置附件上传根目录
        $upload->savePath  =  ''; // 设置附件上传（子）目录
        $upload->saveName = time().mt_rand(100000,999999); //文件名称创建时间戳+随机数
        $upload->autoSub  = true; //自动使用子目录保存上传文件 默认为true
        $upload->subName  = $path; //子目录创建方式，采用数组或者字符串方式定义
        // 上传文件 
        $info = $upload->uploadOne($file);
        if(!$info) {// 上传错误提示错误信息
            return $upload->getError();
        }else{// 上传成功 获取上传文件信息
            //return 'UploadFiles/'.$file['savepath'].$file['savename'];
            return $info;
        }
    }


}