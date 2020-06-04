import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Layout, Row, Col, Spin, Empty, List, Typography, Button, Modal, message } from 'antd'
const { Title } = Typography
const { Header, Content } = Layout
const { confirm } = Modal
import { ExclamationCircleOutlined } from '@ant-design/icons'
import "../../layout/Layout.css"

const Student=()=>{
    const [reloadList, setReloadList] = useState(null)
    // Új tanuló hozzáadása
    const onClickAddNewStudent=()=>{
        console.log('yolo')
        setReloadList(new Date().getTime())
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
                <ListStudent reload={reloadList}/>
            </Content>
        </Layout>
    )
}

const ListStudent =({reload})=>{
    const [trigger, setTrigger] = useState(reload)
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
        [trigger]
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
export default Student