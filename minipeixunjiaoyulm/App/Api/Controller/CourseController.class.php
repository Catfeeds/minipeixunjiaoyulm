<?php
// 本类由系统自动生成，仅供测试用途
namespace Api\Controller;
use Think\Controller;
class CourseController extends PublicController {
    //*****************************
    //  培训课程  详情
    //*****************************
    public function index(){
        $id=intval($_REQUEST['id']);
        $detail=M('course')->where('del=0 AND id='.intval($id))->find();
        if (!$detail) {
            echo json_encode(array('status'=>0,'err'=>'没有找到相关信息.'));
            exit();
        }

        $detail['photo'] = __DATAURL__.$detail['photo'];
        if (intval($detail['opentime'])>0) {
            $detail['opentime'] = date('Y-m-d H:i',$detail['opentime']);
        }else{
            $detail['opentime'] = '待定';
        }

        $detail['addtime'] = date('Y-m-d H:i',$detail['addtime']);
        //转义html
        $content = str_replace('/miniweddingcybl/Data/', __DATAURL__, $detail['content']);
        $detail['content']=html_entity_decode($content, ENT_QUOTES ,'utf-8');
        //$detail['content']='';
        $detail['eng'] = 'Standard Class';

        echo json_encode(array('status'=>1,'info'=>$detail));
        exit();
    }

    //************************
    //   获取 培训课程 列表
    //************************
    public function lists(){
        $page = intval($_REQUEST['page']);
        if (!$page) {
            $page = 1;
        }
        $limit = intval($page*8)-8;

        $course = M('course')->where('del=0')->order('addtime desc')->field('id,title,intro,photo')->limit($limit.',8')->select();
        foreach ($course as $k => $v) {
            $course[$k]['photo'] = __DATAURL__.$v['photo'];
        }
        echo json_encode(array('status'=>1,'list'=>$course));
        exit();
    }

    //************************
    //   获取所有的  培训课程
    //************************
    public function getlist(){
        $list = M('course')->where('del=0')->field('id,title,price')->select();
        foreach ($list as $k => $v) {
            if (floatval($v['price'])>0) {
                $list[$k]['title'] = $v['title'].'(预付:'.floatval($v['price']).'元)';
            }else{
                $list[$k]['title'] = $v['title'].'(免费)';
            }
        }
        echo json_encode(array('status'=>1,'list'=>$list,'date'=>date("Y-m-d")));
        exit();
    }

    //************************
    //     会员报名培训课程
    //************************
    public function course(){

        $uid = intval($_POST['uid']);
        if (!$uid) {
            echo json_encode(array('status'=>0,'err'=>'用户状态异常！'));
            exit();
        }

        $course_id = intval($_POST['course_id']);
        if (!$course_id) {
            echo json_encode(array('status'=>0,'err'=>'请选择报名活动！'));
            exit();
        }

        $check = M('user_course')->where('course_id='.intval($course_id).' AND uid='.intval($uid))->find();
        if ($check) {
            echo json_encode(array('status'=>0,'err'=>'您已经报名了该活动！'));
            exit();
        }

        $check2 = M('course')->where('id='.intval($course_id).' AND del=0')->find();
        if (!$check2) {
            echo json_encode(array('status'=>0,'err'=>'活动信息错误！'));
            exit();
        }

        $tel = intval($_POST['tel']);
        if (!$tel) {
            echo json_encode(array('status'=>0,'err'=>'请输入您的联系方式！'));
            exit();
        }

        $data = array();
        $data['uid'] = $uid;
        $data['course_id'] = $course_id;
        $data['tel'] = $tel;
        $data['truename'] = trim($_POST['truename']);
        $data['sex'] = intval($_POST['sex']);
        $data['birthday'] = strtotime($_POST['birthday']);
        $data['qq'] = trim($_POST['qq']);
        $data['city'] = trim($_POST['city']);
        $data['hy'] = intval($_POST['hy']);
        $data['sg'] = trim($_POST['sg']);
        $data['xl'] = trim($_POST['xl']);
        $data['yx'] = trim($_POST['yx']);
        $data['email'] = trim($_POST['email']);
        $data['weixin'] = trim($_POST['weixin']);
        $data['address'] = trim($_POST['address']);
        $data['remark'] = $_POST['remark'];
        $data['lxdx'] = $_POST['lxdx'];
        $data['addtime'] = time();
        $res = M('user_course')->add($data);
        if ($res) {
            //修改报名人数
            $up  =array();
            $up['num'] = intval($check2['num'])+1;
            M('course')->where('id='.intval($course_id))->save($up);
            echo json_encode(array('status'=>1));
            exit();
        }else{
            echo json_encode(array('status'=>0,'err'=>'报名失败，请稍后再试！'));
            exit();
        }
    }
    
}