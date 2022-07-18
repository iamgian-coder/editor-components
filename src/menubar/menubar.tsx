import React from "react";
import classnames from "classnames";
import addEventListener from "rc-util/lib/Dom/addEventListener";
import { MenubarItem } from "./item";
import { MenubarContext } from "./context";

export class Menubar extends React.PureComponent<Menubar.Props, Menubar.State> {
  private removeDocClickEvent: (() => void) | null | undefined;

  constructor(props: Menubar.Props) {
    super(props);
    this.state = { active: false };
  }

  componentWillUnmount() {
    this.unbindDocEvent();
  }

  onDocumentClick = () => {
    //这里重置了menubar的active状态
    this.setState({ active: false });
    this.unbindDocEvent();
  };

  unbindDocEvent() {
    if (this.removeDocClickEvent) {
      this.removeDocClickEvent();
      this.removeDocClickEvent = null;
    }
  }

  //这里给document添加了原生的事件处理器，冒泡导致menubar的active状态被重置为false
  activeMenubar = () => {
    this.setState({ active: true });
    console.log(
      "激活Menubar，如果没有绑定document.onclick则绑定并将返回值的remove属性赋值给this.removeDocClickEvent"
    );
    if (!this.removeDocClickEvent) {
      this.removeDocClickEvent = addEventListener(
        document.documentElement,
        "click",
        this.onDocumentClick
      ).remove;
    }
  };

  render() {
    const { prefixCls, className, children, extra } = this.props;
    const baseCls = `${prefixCls}-menubar`;
    const contextValue: MenubarContext.Contexts = {
      prefixCls: baseCls,
      activeMenubar: this.activeMenubar,
      menubarActived: this.state.active === true,
    };

    return (
      <div className={classnames(baseCls, className)}>
        <div className={`${baseCls}-content`}>
          <div className={`${baseCls}-content-inner`}>
            <MenubarContext.Provider value={contextValue}>
              {children}
            </MenubarContext.Provider>
          </div>
          {extra && <div className={`${baseCls}-content-extras`}>{extra}</div>}
        </div>
      </div>
    );
  }
}

export namespace Menubar {
  export const Item = MenubarItem;

  export interface Props extends React.PropsWithChildren<unknown> {
    prefixCls?: string;
    className?: string;
    extra?: React.ReactNode;
  }

  export interface State {
    active?: boolean;
  }

  export const defaultProps: Props = {
    prefixCls: "x6",
  };
}
