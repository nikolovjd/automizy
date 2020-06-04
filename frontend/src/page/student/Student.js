import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { 
    Layout, 
    Row, 
    Col, 
    Spin, 
    Empty, 
    List, 
    Typography, 
    Button, 
    Modal, 
    message,
    Form, 
    Input } from 'antd'
const { Title } = Typography
const { Header, Content } = Layout
const { confirm } = Modal
import { ExclamationCircleOutlined } from '@ant-design/icons'
import "../../layout/Layout.css"

const Student=()=>{
    const [reloadListTrigger, setReloadListTrigger] = useState(null)
    const [showModal, setShowModal] = useState(false)
    // Új tanuló hozzáadása gombra kattintás
    const onClickAddNewStudent=()=>{
        setShowModal(true)
    }
    const onClickCancel=()=>{
        setShowModal(false)
    }
    const onDone=({name})=>{
        setShowModal(false)
        setReloadListTrigger(new Date().getTime())
        message.success('The following student has been saved: ' + name)
    }
    return(
        <Layout>
            <Header className="header">
                <Row>
                    <Col span={22}>
                        <Title>Student Handler</Title>
                    </Col>
                    <Col span={2}>
                        <Button 
                            type="primary"
                            onClick={onClickAddNewStudent}>
                            Add new Student
                        </Button>
                    </Col>
                </Row>
            </Header>
            <Content className="content">
                <ListStudent reloadListTrigger={reloadListTrigger}/>
                <AddStudentModal visible={showModal} onClickCancel={onClickCancel} onDone={onDone}/>
            </Content>
        </Layout>
    )
}

// Tanulók listázása
const ListStudent =({reloadListTrigger})=>{
    const [trigger, setTrigger] = useState()
    const [loader, setLoader] = useState(true)

    const [list, setList] = useState({
        data: null,
        complete: false,
        error: false
    })
    // Tanulók betöltése
    useEffect(
        () => {
            setLoader(true)
            setList({
                data: list.data,
                error: false,
                complete: false
            })
            axios.get('api/student')
            .then(res => {
                    setLoader(false)
                    setList({
                        data: res.data,
                        error: false,
                        complete: true
                    })
                }
            )
            .catch(() =>{
                    setLoader(false)
                    setList({
                        data: null,
                        error: true,
                        complete: true
                    })
                }
            )
        },
        [trigger, reloadListTrigger]
    )
    // Adott tanuló törlésére kattinttás
    const onClickDeleteStudent=({name, id})=>{
        confirm({
          title: 'Are you sure delete this student?',
          icon: <ExclamationCircleOutlined />,
          content: name,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            deleteStudent({name: name, id: id})
          },
          onCancel() {}
        })
    }
    // Tanuló törlése
    const deleteStudent=({id, name})=>{
        setLoader(true)
        axios.delete('api/student/' + id )
        .then(res =>{
                message.success('The following student has been deleted: ' + name)
                setLoader(false)
                setTrigger(new Date().getTime())
            }
        )
        .catch(() =>
            setLoader(false)
        )
    }
    return(                
    <Spin
        size="large"
        spinning={loader}>
        <Row style={{ marginTop: 8, marginBottom: 8 }}>
            <Col span={24}>
                {(list.complete && (
                    list.data &&
                    list.data.students.length ?
                    <List
                        bordered
                        dataSource={list.data.students}
                        renderItem={item => (
                            <List.Item>
                                <Typography.Text strong>
                                    {item.first_name} {item.last_name}
                                </Typography.Text>
                                <Typography.Text>
                                    {item.email}
                                </Typography.Text>
                                <Button 
                                    type="primary"
                                    onClick={ ({id = item.id, name = item.first_name + " " + item.last_name }) => onClickDeleteStudent({id: id, name: name})}>
                                    Delete
                                </Button>
                            </List.Item>
                        )}
                    />
                    :
                    <Empty/>
                ))}
            </Col>
        </Row>
    </Spin>
    )
}
// Új tanuló felvitele
const AddStudentModal=({
    visible,
    onClickCancel,
    onDone
})=>{
    const [form] = Form.useForm()

    const onClickSave=()=>{
        form
        .validateFields()
        .then(values => {
            saveStudent({
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email
            })
        })
        .catch(info => {
            console.log('Validate Failed:', info)
        })
    }
    // Tanuló mentése
    const saveStudent = ({first_name, last_name, email}) => {
        axios.post('api/student',{
            'first_name': first_name,
            'last_name': last_name,
            'email': email
        })
        .then(()=>{
            form.resetFields()
            onDone({name: first_name + ' ' + last_name})
        })
        .catch((err)=>{
            if (err.response.status === 409) {
                setDuplicationErrorMessage({name: err.response.data.error})
            } else {
            }
        })
    }
    const setDuplicationErrorMessage = ({name}) => {
        console.log(name)
        form.setFields([
            {
                name: Object.keys(name)[0],
                errors: ["Alredy exists"]
            }
        ])
    }
    return(
        <Modal
            visible={visible}
            title="Add new student"
            onCancel={onClickCancel}
            footer={[
                <Button key="cancel" onClick={onClickCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={onClickSave}>
                    Save
                </Button>
            ]}
            >
            <Form
                form={form}
                layout="vertical"
                >
                <Form.Item
                    label={'First name'}
                    name="first_name"
                    rules={[{required: true, message: 'Please type student first name!'}]}
                >
                    <Input
                        autoComplete='off'
                        placeholder="First name"/>
                </Form.Item>
                <Form.Item
                    label={'Last name'}
                    name="last_name"
                    rules={[{required: true, message: 'Please type student last name!'}]}
                >
                    <Input
                        autoComplete='off'
                        placeholder="Last name"/>
                </Form.Item>
                <Form.Item
                    label={'Email address'}
                    name="email"
                    rules={[{required: true, message: 'Please type student email address!'}]}
                >
                    <Input
                        autoComplete='off'
                        placeholder="Email address"/>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Student