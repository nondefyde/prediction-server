import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { Utils } from 'mpr/core';

const OWNER_ROLE = 'owner';

@Injectable()
export class SeedService {
  public customerIds = [
    '6383fdafc307cb2e7b1019a5',
    '6383fdafc307cb2e7b1019a6',
    '6383fdafc307cb2e7b1019a7',
    '6383fdafc307cb2e7b1019a8',
    '6383fdafc307cb2e7b1019a9',
    '6383fdafc307cb2e7b1019a0',
    '6383fdafc307cb2e7b1019a1',
    '6383fdafc307cb2e7b1019a2',
    '6383fdafc307cb2e7b1019a3',
    '6383fdafc307cb2e7b1019a4',
  ];

  public userIds = [
    '6383fdafc307cb2e7b1019a5',
    '6383fdafc307cb2e7b1019a6',
    '6383fdafc307cb2e7b1019a7',
    // '6383fdafc307cb2e7b1019a8',
    // '6383fdafc307cb2e7b1019a9',
    // '6383fdafc307cb2e7b1019a0',
    // '6383fdafc307cb2e7b1019a1',
    // '6383fdafc307cb2e7b1019a2',
    // '6383fdafc307cb2e7b1019a3',
    // '6383fdafc307cb2e7b1019a4',
  ];

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private config: ConfigService,
  ) {}

  async deleteData(models, key, ids, idObjectIds = true) {
    for (const model of models) {
      const data = await this.connection.models[model].deleteMany({
        $or: [
          {
            [key]: {
              $in: idObjectIds
                ? [...ids].map((i) => new mongoose.Types.ObjectId(i))
                : [...ids],
            },
          },
        ],
      });
      console.log('data :::: ', model, data);
    }
  }

  async init() {
    await this.deleteData(['Auth', 'User'], '_id', this.userIds);
    await this.deleteData(
      [
        'Order',
        'Transaction',
        'MenuCategory',
        'MenuItem',
        'MenuExtra',
        'UserRole',
        'Vendor',
        'Customer',
        'FeedBack',
      ],
      'user',
      this.userIds,
    );
    await this.deleteData(
      ['Counter'],
      'unique',
      [...this.userIds, ...this.customerIds],
      false,
    );
    return true;
  }

  async seed() {
    await this.init();
    const vendors = await this.seedVendors(this.userIds.length);
    const customers = await this.createCustomers(this.customerIds.length);
    const menuCategories = await this.seedMenuCategories(vendors);
    const menuExtras = await this.seedMenuExtras(vendors);
    const menuItems = await this.seedMenuItems(
      vendors,
      menuCategories,
      menuExtras,
    );
    const orders = await this.seedOrders(
      customers,
      vendors,
      menuItems,
      menuExtras,
    );
    const feedback = await this.seedFeedback(orders);

    return {
      vendors: vendors.map((v) => v._id),
      customers: customers.map((c) => c._id),
      menuCategories: menuCategories.map((c) => c._id),
      menuExtras: menuExtras.map((c) => c._id),
      menuItems: menuItems.map((m) => m._id),
      orders: orders.map((m) => m._id),
      feedback: feedback.map((m) => m._id),
    };
  }

  async seedVendors(count: number) {
    try {
      const hashedPassword = await bcrypt.hash('password', 10);
      const vendors = [];
      for (let i = 0; i < count; i++) {
        const auth: any = await new this.connection.models['Auth']({
          _id: new mongoose.Types.ObjectId(this.userIds[i]),
          email: `test${i + 1}@gmail.com`,
          mobile: {
            phoneNumber: faker.phone.number('+234##########'),
            isoCode: 'NG',
          },
          bvn: '12354211222',
          verifications: {
            email: true,
            mobile: true,
          },
          password: hashedPassword,
          publicId: Utils.generateUniqueId('ath'),
          deleted: false,
        }).save();

        const [user, vendor] = await Promise.all([
          new this.connection.models['User']({
            _id: auth._id,
            email: auth.email,
            mobile: auth.mobile,
            bvn: auth.bvn,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            dob: faker.date.past(),
            gender: this.getRandomInt(0, 1) === 0 ? 'Male' : 'Female',
            avatar: faker.internet.avatar(),
            publicId: Utils.generateUniqueId('usr'),
            deleted: false,
          }).save(),
          new this.connection.models['Vendor']({
            user: auth._id,
            businessName: faker.company.name(),
            businessUserName: `chow-store${i + 1}`,
            businessEmail: faker.internet.email(),
            businessLogo: faker.image.business(150, 150, true),
            businessBanner: faker.image.food(150, 150, true),
            ...this.getVendorRandomData(),
            socials: {
              facebook: faker.internet.url(),
              instagram: faker.internet.url(),
              twitter: faker.internet.url(),
            },
            publicId: Utils.generateUniqueId('vnd'),
            isDefault: i === 0,
            deleted: false,
          }).save(),
        ]);
        await new this.connection.models['Setting']({
          user: user._id,
          vendor: vendor._id,
          publicId: Utils.generateUniqueId('sett'),
          deleted: false,
        }).save();
        await this.assignOwnerRole(user, OWNER_ROLE);
        vendors.push(vendor);
      }
      return vendors;
    } catch (e) {
      console.log('vendor :::: ', e);
    }
  }

  /**
   * @param {Object} user The user object
   * @param {Object} title The title of role
   * @return {String} return code
   */
  public async assignOwnerRole(user, title) {
    try {
      const ownerRole = await this.connection.models['Role'].findOneAndUpdate(
        {
          title,
          isDefault: true,
        },
        {
          $setOnInsert: { title, isDefault: true },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      return await this.connection.models['UserRole'].findOneAndUpdate(
        {
          role: ownerRole._id,
          user: user._id,
        },
        {
          $setOnInsert: {
            publicId: Utils.generateUniqueId('usr'),
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    } catch (e) {
      console.log('assignOwnerRole :: ', e);
    }
  }

  async createCustomers(count: number) {
    try {
      const customers = [];
      for (let i = 0; i < count; i++) {
        const customerNo = await this.incrementId('customers', 'customer');
        const customerPayload = {
          _id: new mongoose.Types.ObjectId(this.customerIds[i]),
          email: faker.internet.email(),
          mobile: {
            phoneNumber: faker.phone.number('+234##########'),
            isoCode: 'NG',
          },
          customerNo,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          dob: faker.date.past(),
          gender: faker.name.gender(),
          avatar: faker.internet.avatar(),
          socialAuth: true,
          socialAuthType: this.getSocialAuthType(),
          socialId: faker.datatype.number({ min: 1000000 }),
          verifications: {
            email: true,
            mobile: true,
          },
          addresses: [
            {
              name: faker.address.cityName(),
              addressLine_1: faker.address.streetAddress(),
              addressLine_2: faker.address.streetAddress(),
              city: faker.address.city(),
              state: faker.address.state(),
              postalCode: faker.address.zipCode(),
              country: faker.address.country(),
              coordinates: [
                this.getRandomIntegerNotMoreThanN(100),
                this.getRandomIntegerNotMoreThanN(100),
              ],
            },
          ],
        };
        const customer = await this.connection.models[
          'Customer'
        ].findOneAndUpdate(
          { _id: this.customerIds[i], deleted: false },
          {
            publicId: Utils.generateUniqueId('cust'),
            ...customerPayload,
          },
          { upsert: true, setDefaultsOnInsert: true, new: true },
        );
        customers.push(customer);
      }
      return customers;
    } catch (e) {
      console.log('customer : ', e);
    }
  }

  async seedOrders(customers, vendors, menuItems, menuExtras) {
    try {
      let orders = [];
      for (let i = 0; i < vendors.length; i++) {
        const ords = await this.mockOrders(
          this.getRandomSubarray(
            customers,
            this.getRandomInt(1, customers.length - 1),
          ),
          vendors[i],
          menuItems,
          menuExtras,
        );
        orders = orders.concat(ords);
      }
      return orders;
    } catch (e) {
      console.log('orders : ', e);
    }
  }

  async seedFeedback(orders) {
    try {
      const feedback = [];
      for (let i = 0; i < orders.length; i++) {
        const feedbackPayload = {
          user: orders[i].user,
          vendor: orders[i].vendor,
          customer: orders[i].customer,
          order: orders[i]._id,
          title: faker.word.adjective({ strategy: 'any-length' }),
          description: faker.word.adjective({ strategy: 'any-length' }),
          status: this.getFeedbackStatus(),
        };
        const feeds = await new this.connection.models['FeedBack']({
          ...feedbackPayload,
          publicId: Utils.generateUniqueId('feedback'),
        }).save();
        feedback.push(feeds);
      }
      return feedback;
    } catch (e) {
      console.log('feedback ', e);
    }
  }

  async seedMenuCategories(vendors) {
    try {
      let menuCategories = [];
      for (let i = 0; i < vendors.length; i++) {
        const categories = await this.mockMenuCategories(
          this.getRandomInt(2, 10),
          vendors[i],
        );
        menuCategories = menuCategories.concat(categories);
      }
      return menuCategories;
    } catch (e) {
      console.log('category ::: ', e);
    }
  }

  async seedMenuItems(vendors, menuCategories, menuExtras) {
    try {
      let menuItems = [];
      for (let i = 0; i < vendors.length; i++) {
        const vendorCategories = menuCategories.filter(
          (mc) => String(mc.vendor) === String(vendors[i]._id),
        );
        const vendorMenuExtras = menuExtras.filter(
          (ext) => String(ext.vendor) === String(vendors[i]._id),
        );
        const menuItemSubs = await this.mockMenuItems(
          this.getRandomInt(5, 20),
          vendors[i],
          this.getRandomSubarray(
            vendorCategories,
            this.getRandomInt(1, vendorCategories.length - 1),
          ),
          vendorMenuExtras,
        );
        menuItems = menuItems.concat(menuItemSubs);
      }
      return menuItems;
    } catch (e) {
      console.log('menu items ', e);
    }
  }

  async seedMenuExtras(vendors) {
    try {
      let menuExtras = [];
      for (let i = 0; i < vendors.length; i++) {
        const menuExtra = await this.mockMenuExtras(
          this.getRandomInt(5, 20),
          vendors[i],
        );
        menuExtras = menuExtras.concat(menuExtra);
      }
      return menuExtras;
    } catch (e) {
      console.log('menu extra ', e);
    }
  }

  async mockMenuCategories(count: number, vendor: any) {
    const menuCategories = [];
    for (let i = 0; i < count; i++) {
      const menuCategoriesPayload = {
        user: vendor.user,
        vendor: vendor._id,
        title: faker.word.adjective({ strategy: 'any-length' }),
        description: faker.word.adjective({ strategy: 'any-length' }),
        // image: faker.image.imageUrl(50, 50, 'food', true),
      };
      const menuCategory = await new this.connection.models['MenuCategory']({
        ...menuCategoriesPayload,
        publicId: Utils.generateUniqueId('menu-ctg'),
      }).save();
      menuCategories.push(menuCategory);
    }
    return menuCategories;
  }

  async mockMenuItems(
    count: number,
    vendor: any,
    categories: any,
    menuExtras: any,
  ) {
    const menuItems = [];
    const extras = menuExtras.map(({ _id }) => _id);
    for (let i = 0; i < count; i++) {
      const menuItemPayload = {
        user: vendor.user,
        vendor: vendor._id,
        category: categories[this.getRandomInt(0, categories.length - 1)],
        title: faker.word.adjective({ strategy: 'any-length' }),
        description: faker.word.adjective({ strategy: 'any-length' }),
        price:
          Math.round(faker.datatype.number({ min: 100, max: 10000 }) / 100) *
          100,
        hasExtras: faker.datatype.boolean(),
        image: faker.image.food(150, 150, true),
        menuExtras: [
          ...this.getRandomSubarray(
            extras,
            this.getRandomInt(1, extras.length - 1),
          ),
        ],
      };
      const menuItem = await new this.connection.models['MenuItem']({
        ...menuItemPayload,
        publicId: Utils.generateUniqueId('menu-item'),
      }).save();
      menuItems.push(menuItem);
    }
    return menuItems;
  }

  async mockMenuExtras(count: number, vendor: any) {
    const menuExtras = [];
    for (let i = 0; i < count; i++) {
      const menuExtraPayload = {
        user: vendor.user,
        vendor: vendor._id,
        title: faker.word.adjective({ strategy: 'any-length' }),
        description: faker.word.adjective({ strategy: 'any-length' }),
        price:
          Math.round(faker.datatype.number({ min: 100, max: 10000 }) / 100) *
          100,
        quantity: this.getRandomIntegerNotMoreThanN(50),
        image: faker.image.food(150, 150, true),
        active: this.getBooleanValue(),
      };
      const menuExtra = await new this.connection.models['MenuExtra']({
        ...menuExtraPayload,
        publicId: Utils.generateUniqueId('menu-extra'),
      }).save();
      menuExtras.push(menuExtra);
    }
    return menuExtras;
  }

  async mockOrders(
    customers: any,
    vendor: any,
    meuItems: any,
    menuExtras: any,
  ) {
    let orders = [];
    for (let i = 0; i < customers.length; i++) {
      const custOrders = await this.generateOrders(
        this.getRandomInt(2, 10),
        vendor,
        customers[i],
        meuItems,
        menuExtras,
      );
      orders = orders.concat(custOrders);
    }
    return orders;
  }

  async generateOrders(count, vendor, customer, meuItems, menuExtras) {
    const orders = [];
    for (let i = 0; i < count; i++) {
      const transactionRef = faker.finance.bitcoinAddress();
      const customerRef = faker.finance.bitcoinAddress();
      const orderPayload = {
        user: vendor.user,
        vendor: vendor._id,
        customer: customer._id,
        transactionRef,
        customerRef,
        status: ['processing', 'ready', 'completed'][this.getRandomInt(0, 2)],
        deliveryLocation: {
          rate: this.getRandomIntegerNotMoreThanN(10000),
          location: faker.address.city(),
        },
        address: {
          name: faker.address.cityName(),
          addressLine_1: faker.address.streetAddress(),
          addressLine_2: faker.address.streetAddress(),
          city: faker.address.city(),
          state: faker.address.state(),
          postalCode: faker.address.zipCode(),
          country: faker.address.country(),
          coordinates: [
            this.getRandomIntegerNotMoreThanN(100),
            this.getRandomIntegerNotMoreThanN(100),
          ],
        },
        items: this.getRandomOrderItem(
          this.getRandomInt(1, 4),
          vendor,
          meuItems,
          menuExtras,
        ),
      };
      const orderNo = await this.incrementId('orders', vendor._id);
      const order = await new this.connection.models['Order']({
        ...orderPayload,
        orderNo,
        publicId: Utils.generateUniqueId('ord'),
      }).save();
      if (!['in-cart', 'cancelled'].includes(order.status)) {
        await this.generateTransaction(order, customer);
      }
      orders.push(order);
    }
    return orders;
  }

  getTransactionStatus() {
    const status = [
      'initiated',
      'pending',
      'success',
      'failed',
      'abandoned',
      'cancelled',
    ];
    return status[this.getRandomInt(0, status.length - 1)];
  }

  async generateTransaction(order, customer) {
    const status = this.getTransactionStatus();
    const transactionPayload = {
      object: order._id,
      amount: this.calculateItemsTotal(order.items),
      totalAmount: this.calculateItemsTotal(order.items),
      fee: 0,
      transactionRef: ['processing', 'ready', 'completed'].includes(
        order.status,
      )
        ? order.transactionRef
        : undefined,
      order: order._id,
      customer: customer._id,
      user: order.user,
      vendor: customer._id,
      paid: order.status === 'completed' && status === 'success',
      paymentDate: new Date(),
      status,
      data: {
        order: order._id,
        coupon: faker.lorem.text(),
        total: this.calculateItemsTotal(order.items),
        deliveryLocation: order.deliveryLocation,
        address: order.address,
      },
    };
    const transactionNo = await this.incrementId('transactions', order.vendor);
    await new this.connection.models['Transaction']({
      ...transactionPayload,
      publicId: Utils.generateUniqueId('trx'),
      transactionNo,
    }).save();
  }

  getRandomIntegerNotMoreThanN(n: number) {
    const rand = Math.floor(Math.random() * n) + 1;
    return rand;
  }

  getSocialAuthType = () => {
    const socialAuthType = ['facebook', 'google', 'apple'];
    const rand = this.getRandomInt(0, 2);
    return socialAuthType[rand];
  };

  getBooleanValue = () => {
    return this.getRandomInt(0, 1) === 1;
  };

  getOrderStatus = () => {
    const orderStatus = [
      'in-cart',
      'pending',
      'processing',
      'ready',
      'completed',
      'cancelled',
    ];
    const rand = this.getRandomInt(0, orderStatus.length - 1);
    return orderStatus[rand];
  };

  getFeedbackStatus = () => {
    const feedbackStatus = ['unread', 'flag', 'read'];
    const rand = this.getRandomInt(0, feedbackStatus.length - 1);
    return feedbackStatus[rand];
  };

  /**
   * return a subset of the genre above
   * @return {Array}
   */
  public getRandomSubarray(arr: any, size: number): any {
    const shuffled = arr.slice(0);
    let i = arr.length,
      temp,
      index;
    const min = i - size;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }

  async incrementId(entity, unique) {
    const { seq } = await this.connection.models['Counter'].findOneAndUpdate(
      { unique, entity },
      {
        $setOnInsert: {
          unique,
          entity,
        },
        $inc: { seq: 1 },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
    return seq;
  }

  public getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public getRandomTime(min, max) {
    const time = this.getRandomInt(min, max);
    return `${String(time).padStart(2, '0')}:00`;
  }

  public getRandomOperationalHours() {
    const operatingHours = {
      monday: {
        openAt: this.getRandomTime(6, 12),
        closeAt: this.getRandomTime(12, 23),
        is24Hours: faker.datatype.boolean(),
      },
      tuesday: {
        openAt: this.getRandomTime(6, 12),
        closeAt: this.getRandomTime(12, 23),
        is24Hours: faker.datatype.boolean(),
      },
      wednesday: {
        openAt: this.getRandomTime(6, 12),
        closeAt: this.getRandomTime(12, 23),
        is24Hours: faker.datatype.boolean(),
      },
      thursday: {
        openAt: this.getRandomTime(6, 12),
        closeAt: this.getRandomTime(12, 23),
        is24Hours: faker.datatype.boolean(),
      },
      friday: {
        openAt: this.getRandomTime(6, 12),
        closeAt: this.getRandomTime(12, 23),
        is24Hours: faker.datatype.boolean(),
      },
      saturday: {
        openAt: this.getRandomTime(6, 12),
        closeAt: this.getRandomTime(12, 23),
        is24Hours: faker.datatype.boolean(),
        closed: faker.datatype.boolean(),
      },
      sunday: {
        openAt: this.getRandomTime(6, 12),
        closeAt: this.getRandomTime(12, 23),
        is24Hours: faker.datatype.boolean(),
        closed: faker.datatype.boolean(),
      },
    };
    return operatingHours;
  }

  public deliveryLocationRates() {
    const count = this.getRandomInt(2, 5);
    const locations = [];
    for (let i = 0; i < count; i++) {
      const rate = {
        rate: Math.round(faker.datatype.number(10000) / 100) * 100,
        location: faker.address.city(),
      };
      locations.push(rate);
    }
    return locations;
  }

  public getVendorRandomData() {
    const mode = ['pickup', 'delivery', 'both'];
    const category = [
      'restaurant',
      'hotel',
      'fast-food',
      'private-kitchen',
      'others',
    ];
    const capacity = ['0-10', '11-30', '31-50', '51-100', 'Above 100'];
    const pattern = ['scheduled', 'same-day', 'both'];
    const discount = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    return {
      businessCategory: category[this.getRandomInt(0, category.length - 1)],
      businessCapacity: capacity[this.getRandomInt(0, capacity.length - 1)],
      salesPattern: pattern[this.getRandomInt(0, pattern.length - 1)],
      deliveryMode: mode[this.getRandomInt(0, mode.length - 1)],
      discount: discount[this.getRandomInt(0, discount.length - 1)],
      isFreeDelivery: faker.datatype.boolean(),
      operatingHours: this.getRandomOperationalHours(),
      deliveryHours: this.getRandomOperationalHours(),
      deliveryLocationRates: this.deliveryLocationRates(),
    };
  }

  public getRandomOrderItem(
    count: number,
    vendor: any,
    menuItems: any,
    menuExtras: any,
  ): any {
    const vendorItems = menuItems.filter(
      (m) => String(m.vendor) === String(vendor._id),
    );
    const vendorExtras = menuExtras.filter(
      (m) => String(m.vendor) === String(vendor._id),
    );
    const items = [];
    if (vendorItems.length) {
      for (let i = 0; i < count; i++) {
        const mItem = vendorItems[this.getRandomInt(0, vendorItems.length - 1)];
        if (mItem) {
          const payload = _.pick(mItem, ['_id', 'price', 'image', 'title']);
          const extras = [];
          if (vendorExtras.length) {
            const asId = mItem?.menuExtras.map((m) => String(m));
            const fEtras = vendorExtras.filter((e) =>
              asId.includes(String(e._id)),
            );
            const mExtras = fEtras.length
              ? this.getRandomSubarray(
                  fEtras,
                  this.getRandomInt(0, fEtras.length - 1),
                )
              : [];
            mExtras.forEach((e) => {
              const payload = _.pick(e, ['_id', 'price', 'image', 'title']);
              extras.push({
                ...payload,
                count: this.getRandomInt(1, 4),
              });
            });
          }
          const item = {
            ...payload,
            count: this.getRandomInt(1, 4),
            extras,
          };
          items.push(item);
        }
      }
    }
    return items;
  }

  public calculateItemsTotal(items) {
    return items.reduce((a, c) => {
      const extraTotal = c?.extras?.length
        ? c.extras?.reduce((ac, cc) => ac + cc.price, 0)
        : 0;
      return a + c.price + extraTotal;
    }, 0);
  }
}
