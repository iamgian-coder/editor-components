import React from "react";
import classnames from "classnames";
import addEventListener from "rc-util/lib/Dom/addEventListener";
import { MenubarContext } from "./context";

const cacheDeactiveMap = new WeakMap();
class MenubarItemInner extends React.PureComponent<
  MenubarItemInner.Props,
  MenubarItemInner.State
> {
  private readonly popupClassName: string;

  private removeDocClickEvent: (() => void) | null | undefined;

  constructor(props: MenubarItemInner.Props) {
    super(props);
    this.popupClassName = `${props.context.prefixCls}-item-dropdown`;
    this.state = { active: false };
  }

  onDocumentClick = () => {
    this.deactive();
  };

  onClick = (e: React.MouseEvent) => {
    // console.log('menubar-item click')
    e.stopPropagation(); //少执行了这个导致冒泡到document，进而执行了MenuBar的onDocumentClick，导致MenuBar的active属性重置为false
    this.props.context.activeMenubar();
    this.removeDeactive(e.currentTarget.parentElement);
    this.active();
  };

  isPrevMenuHiddening(e: React.MouseEvent): boolean {
    const toElement = (e.nativeEvent as any).toElement;
    if (toElement && toElement.className === this.popupClassName) {
      return true;
    }

    const currentTarget = e.currentTarget as HTMLDivElement;
    const childNodes = currentTarget.parentElement!.childNodes;
    for (let i = 0, l = childNodes.length; i < l; i += 1) {
      const child = childNodes[i] as HTMLDivElement;
      const popupElem = child.querySelector(`.${this.popupClassName}`)!;
      if (popupElem.contains(toElement)) {
        return true;
      }
    }

    return false;
  }

  onMouseEnter = (e: React.MouseEvent) => {
    // console.log("menubarinneritem-onmouseenter");
    if (
      this.props.context.menubarActived &&
      !this.state.active &&
      !this.isPrevMenuHiddening(e)
    ) {
      // console.log("enter-to");
      const currentTarget = e.currentTarget as HTMLDivElement;
      const childNodes = currentTarget.parentElement!.childNodes;

      childNodes.forEach((child) => {
        if (child === currentTarget) {
          this.removeDeactive(child);
        } else {
          this.callDeactive(child);
        }
      });

      this.active();
    }
  };

  onMouseLeave = (e: React.MouseEvent) => {
    // console.log("menubarinneritem-onmouseleave");
    const relatedTarget = e.relatedTarget;
    const currentTarget = e.currentTarget as HTMLDivElement;

    if (this.props.context.menubarActived && this.state.active) {
      // console.log('leave-to')
      const childNodes = currentTarget.parentElement!.childNodes;
      let shoudDeactive = false;
      if (relatedTarget !== window) {
        for (let i = 0, l = childNodes.length; i < l; i += 1) {
          const child = childNodes[i];
          if (
            child === relatedTarget ||
            child.contains(relatedTarget as HTMLDivElement)
          ) {
            shoudDeactive = true;
            break;
          }
        }
      }

      if (shoudDeactive) {
        this.deactive();
      } else {
        // 缓存一下，当再次 hover 到其他菜单时被调用
        this.cacheDeactive(currentTarget);
      }
    }
  };

  cacheDeactive(elem: any) {
    cacheDeactiveMap.set(elem, this.deactive);
  }

  callDeactive(elem: any) {
    if (cacheDeactiveMap.has(elem)) {
      cacheDeactiveMap.get(elem)();
      cacheDeactiveMap.delete(elem);
    }
  }

  removeDeactive(elem: any) {
    cacheDeactiveMap.delete(elem);
  }

  active = () => {
    this.setState({ active: true });
    if (!this.removeDocClickEvent) {
      this.removeDocClickEvent = addEventListener(
        document.documentElement,
        "click",
        this.onDocumentClick
      ).remove;
    }
  };

  deactive = () => {
    this.setState({ active: false });
    if (this.removeDocClickEvent) {
      this.removeDocClickEvent();
      this.removeDocClickEvent = null;
    }
  };

  render() {
    // console.log('menubarinneritem-render')
    const { text, children, hidden } = this.props;
    const { prefixCls, menubarActived } = this.props.context;
    const currentMenuActived = menubarActived && this.state.active;
    const baseCls = `${prefixCls}-item`;

    return (
      <div
        className={classnames(baseCls, {
          [`${baseCls}-hidden`]: hidden,
          [`${baseCls}-hover`]: menubarActived,
          [`${baseCls}-active`]: currentMenuActived,
        })}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div
          className={classnames(`${baseCls}-text`, {
            [`${baseCls}-text-active`]: currentMenuActived,
          })}
          onClick={this.onClick}
        >
          {text}
        </div>
        <div className={this.popupClassName}>{children}</div>
      </div>
    );
  }
}

namespace MenubarItemInner {
  export interface Props
    extends MenubarItem.Props,
      React.PropsWithChildren<unknown> {
    context: MenubarContext.Contexts;
  }

  export interface State {
    active?: boolean;
  }
}

export const MenubarItem: React.FC<MenubarItem.Props> = (props) => {
  // console.log('menubaritem-render')
  return (
    <MenubarContext.Consumer>
      {(context) => <MenubarItemInner context={context} {...props} />}
    </MenubarContext.Consumer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace MenubarItem {
  export interface Props extends React.PropsWithChildren<unknown> {
    text: string;
    hidden?: boolean;
  }
}
