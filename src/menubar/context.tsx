import React from 'react'

export const MenubarContext = React.createContext<MenubarContext.Contexts>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  {} as any
)

export namespace MenubarContext {
  export interface Contexts {
    prefixCls: string
    activeMenubar: () => void
    menubarActived: boolean
  }
}
