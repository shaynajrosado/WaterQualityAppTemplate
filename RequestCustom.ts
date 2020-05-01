import { req } from 'express/lib/request';
export default interface RequestCustom extends Request
{
    property: string;
}