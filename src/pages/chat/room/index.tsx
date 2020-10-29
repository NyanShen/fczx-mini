import React from 'react'
import { View, Text, ScrollView, Input, Image } from "@tarojs/components"

import NavBar from '@components/navbar'

import './index.scss'

const ChatRoom = () => {
    return (
        <View className="chat-room">
            <NavBar title="姓名" back={true}></NavBar>
            <View className="chat-room-content">
                <ScrollView scrollY className="msg-box">
                    <View className="msg-item">
                        <View className="item-content">
                            <View className="photo">
                                <Image src="" />
                            </View>
                            <View className="message">
                                <Text className="text">有没有好看一点的房子</Text>
                            </View>
                        </View>
                        <View className="item-tip">
                            <Text className="text">10-29</Text>
                        </View>
                    </View>
                    <View className="msg-item">
                        <View className="item-content item-content-reverse">
                            <View className="photo">
                                <Image src="" />
                            </View>
                            <View className="message">
                                <Text className="text text-primary">稍等，我帮你找一下</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View className="send-box">
                    <View className="send-content">
                        <Input />
                        <View className="btn btn-primary">
                            <Text>发送</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
export default ChatRoom