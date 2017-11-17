<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class ExhibitionController extends PublicController {
    //*****************************
    //  培训课程  详情
    //*****************************
    public function index(){
        $id=intval($_REQUEST['id']);
        $detail=M('exhibition')->where('del=0 AND id='.intval($id))->find();
        if (!$detail) {
            echo json_encode(array('status'=>0,'err'=>'没有找到相关信息.'));
            exit();
        }

        $detail['photo'] = __DATAURL__.$detail['photo'];
        if (intval($detail['opentime'])>0) {
            $detail['opentime'] = date('m月d日',$detail['opentime']);
        }else{
            $detail['opentime'] = '待定';
        }
        if (intval($detail['endtime'])>0) {
            $detail['endtime'] = date('m月d日',$detail['endtime']);
        }else{
            $detail['endtime'] = '待定';
        }
        if (intval($detail['offtime'])>0) {
            $detail['offtime'] = date('Y-m-d H:i',$detail['offtime']);
        }else{
            $detail['offtime'] = '待定';
        }
        
        $detail['addtime'] = date('Y-m-d H:i',$detail['addtime']);

        echo json_encode(array('status'=>1,'info'=>$detail));
        exit();
    }

    //*****************************
    //   获取 培训课程 列表
    //*****************************
    public function lists(){
        $page = intval($_REQUEST['page']);
        if (!$page) {
            $page = 1;
        }
        $limit = intval($page*8)-8;

        $list = M('exhibition')->where('del=0')->order('addtime desc')->field('id,title,intro,photo')->limit($limit.',8')->select();
        foreach ($list as $k => $v) {
            $list[$k]['photo'] = __DATAURL__.$v['photo'];
        }
        echo json_encode(array('status'=>1,'list'=>$list));
        exit();
    }

    //************************
    //   获取所有的  培训课程
    //************************
    public function getlist(){
        $list = M('exhibition')->where('del=0')->field('id,title,price')->select();
        foreach ($list as $k => $v) {
            if (floatval($v['price'])>0) {
                $list[$k]['title'] = $v['title'].'(费用:'.floatval($v['price']).'元)';
            }else{
                $list[$k]['title'] = $v['title'].'(免费)';
            }
        }
        echo json_encode(array('status'=>1,'list'=>$list,'date'=>date("Y-m-d")));
        exit();
    }

    //************************
    //  会员报名培训课程
    //************************
    public function signup(){

        $uid = intval($_POST['uid']);
        $eid = intval($_POST['eid']);
        if (!$uid || !$eid) {
            echo json_encode(array('status'=>0,'err'=>'参数错误！'));
            exit();
        }

        $check = M('sign_up')->where('eid='.intval($eid).' AND uid='.intval($uid))->find();
        if ($check) {
            echo json_encode(array('status'=>0,'err'=>'您的企业已报名了该展会！'));
            exit();
        }

        $check2 = M('exhibition')->where('id='.intval($eid).' AND del=0')->find();
        if (!$check2) {
            echo json_encode(array('status'=>0,'err'=>'展会信息错误！'));
            exit();
        }

        $tel = intval($_POST['tel']);
        if (!$tel) {
            echo json_encode(array('status'=>0,'err'=>'请输入您的联系方式！'));
            exit();
        }

        $data = array();
        $data['uid'] = $uid;
        $data['eid'] = $eid;
        $data['tel'] = $tel;
        $data['company'] = trim($_POST['company']);
        $data['legal_person'] = trim($_POST['uname']);
        $data['yyzz'] = trim($_POST['yyzz']);
        $data['idcard'] = trim($_POST['idcard']);
        $data['addtime'] = time();
        if (floatval($check2['price'])<=0) {
            $data['state'] = 2;
        }
        $res = M('sign_up')->add($data);
        if ($res) {
            //修改报名人数
            $up  =array();
            $up['num'] = intval($check2['num'])+1;
            M('exhibition')->where('id='.intval($eid))->save($up);
            echo json_encode(array('status'=>1));
            exit();
        }else{
            echo json_encode(array('status'=>0,'err'=>'报名失败，请稍后再试！'));
            exit();
        }
    }
    
}