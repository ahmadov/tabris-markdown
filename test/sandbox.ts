import { expect } from 'chai';
import { tabris } from 'tabris';
import ClientMock from 'tabris/ClientMock';
/* tslint:disable no-namespace */

// Initialize tabris module at least once before application code is parsed
tabris._init(new ClientMock());

export { tabris, ClientMock, expect };
