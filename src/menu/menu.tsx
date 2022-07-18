import React, { MouseEvent } from "react";
import classNames from "classnames";
import { MenuItem } from "./item";
import { MenuDivider } from "./divider";
import { MenuContext } from "./context";
import { MenuSubMenu } from "./submenu";

export class Menu extends React.PureComponent<Menu.Props> {
  private onClick = (name: string, e?: MouseEvent) => {
    if (this.props.stopPropagation && e != null) {
      // console.log('Menu根据Menu实例的props.stopPropagation值阻止冒泡')
      e.stopPropagation();
    }

    if (this.props.onClick) {
      console.log("调用Menu实例.props.onClick,同时传入被点击MenuItem的名字");
      this.props.onClick(name);
    }
  };

  private registerHotkey = (hotkey: string, handler: () => unknown) => {
    if (this.props.registerHotkey) {
      this.props.registerHotkey(hotkey, handler);
    }
  };

  private unregisterHotkey = (hotkey: string, handler: () => unknown) => {
    if (this.props.unregisterHotkey) {
      this.props.unregisterHotkey(hotkey, handler);
    }
  };

  render() {
    const { prefixCls, className, children, hasIcon } = this.props;
    const baseCls = `${prefixCls}-menu`;
    const ContextProvider = MenuContext.Provider;
    const contextValue: MenuContext.Contexts = {
      prefixCls: baseCls,
      onClick: this.onClick,
      registerHotkey: this.registerHotkey,
      unregisterHotkey: this.unregisterHotkey,
    };

    //传递给Menu的onClick属性，被当作Context上下文传递下去了，并没与绑定在Menu自身的dom元素上
    return (
      <div
        className={classNames(
          baseCls,
          {
            [`${baseCls}-has-icon`]: hasIcon,
          },
          className
        )}
      >
        <ContextProvider value={contextValue}>{children}</ContextProvider>
      </div>
    );
  }
}

export namespace Menu {
  export const Item = MenuItem;
  export const Divider = MenuDivider;
  export const SubMenu = MenuSubMenu;

  export interface Props extends React.PropsWithChildren<unknown> {
    prefixCls?: string;
    className?: string;
    hasIcon?: boolean;
    stopPropagation?: boolean;
    onClick?: (name: string) => unknown;
    registerHotkey?: (hotkey: string, handler: () => unknown) => unknown;
    unregisterHotkey?: (hotkey: string, handler: () => unknown) => unknown;
  }

  export const defaultProps: Props = {
    prefixCls: "x6",
    stopPropagation: false,
  };
}
