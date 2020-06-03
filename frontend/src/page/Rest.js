import React from 'react'
import { Row, Col, Divider, InputNumber, Button } from 'antd'

const Rest=()=>{
    const onChange = e => {
        const { value } = e.target
    }
    return(
        <>
            <Divider orientation="left">
                Rest calculator example
            </Divider>
            <Row gutter={16} style={{ marginTop: 8, marginBottom: 8 }}>
                <Col className="gutter-row" span={6}>
                    <InputNumber
                        onChange={onChange}
                        min={1} 
                        max={10} 
                    />
                    +
                    <InputNumber
                        onChange={onChange}
                        min={1} 
                        max={10} 
                    />
                    =
                    <InputNumber
                        min={1} 
                        max={10}
                    />
                    <Button type="primary">Calc</Button> 
                </Col>
            </Row>
        </>
    )
}
export default Rest