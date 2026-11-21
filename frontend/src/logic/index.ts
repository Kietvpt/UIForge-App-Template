import { registerBL } from '@uiforge/core'
import * as customerBL from './customerManagement.bl'
import * as dashboardBL from './dashboard.bl'
import * as fclImportBL from './fclImport.bl'
import * as transactionListBL from './transactionList.bl'
import * as transactionDetailBL from './transactionDetail.bl'

/**
 * 📦 Đăng ký toàn bộ các module Business Logic mẫu vào Core EventRunner
 */
export function registerAllBL(): void {
  registerBL('customerManagement.bl.ts', customerBL)
  registerBL('dashboard.bl.ts', dashboardBL)
  registerBL('fclImport.bl.ts', fclImportBL)
  registerBL('transactionList.bl.ts', transactionListBL)
  registerBL('transactionDetail.bl.ts', transactionDetailBL)
  console.log('[UIForge Starter Template] Đã đăng ký 5 module Business Logic mẫu vào @uiforge/core EventRunner.')
}

// Tự động kích hoạt khi import
registerAllBL()
