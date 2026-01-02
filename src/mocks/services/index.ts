/**
 * Service Layer Index
 * Re-exports all services for easy importing
 * 
 * UI components should import from here:
 * import { appService, bugService, userService } from '@/mocks/services';
 */

export { appService } from './appService.mock';
export { bugService, bugAttachmentService } from './bugService.mock';
export { userService } from './userService.mock';
