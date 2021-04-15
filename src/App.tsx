import React from 'react';
import { Layout, Menu } from 'antd';

import './App.css';
import { FirstPart } from './FirstPart';
import { SecondPart } from './SecondPart';

const { Header, Content, Footer } = Layout;
const exampleComponents: React.FunctionComponent[] = [FirstPart, SecondPart];

function App() {
    const [reloadsCount, setReloadsCount] = React.useState(0);
    const [currentExample, setCurrentExample] = React.useState(getCurrentExample());
    const toggleExample = React.useCallback((index: number) => {
        setCurrentExample(index);
        setReloadsCount((x) => x + 1);
        saveCurrentExample(index);
    }, []);

    const Component = exampleComponents[currentExample]!;

    return (
        <Layout>
            <Header className="header">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={['' + currentExample]}
                >
                    {exampleComponents.map((_component, index) => (
                        <Menu.Item
                            onClick={() => toggleExample(index)}
                            key={index}
                        >
                            Part #{index + 1}
                        </Menu.Item>
                    ))}
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }} key={reloadsCount}>
                <Layout
                    className="site-layout-background"
                    style={{ padding: '24px 0' }}
                >
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        {Component ? <Component /> : null}
                    </Content>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Vadim Laletin &bull; beda.software
            </Footer>
        </Layout>
    );
}

export default App;

function getCurrentExample() {
    return localStorage['currentExample'] || 0;
}

function saveCurrentExample(index: number) {
    localStorage['currentExample'] = index;
}
