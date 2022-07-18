import React, { MouseEvent } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MenuContext = React.createContext<MenuContext.Contexts>({} as any)

export namespace MenuContext {
  export interface Contexts {
    prefixCls: string
    onClick: (name: string, e?: MouseEvent) => unknown
    registerHotkey: (hotkey: string, handler: () => unknown) => unknown
    unregisterHotkey: (hotkey: string, handler: () => unknown) => unknown
  }
}
