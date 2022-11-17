import { DuplicateSupportRequest } from '@controllers/duplicate-support-request/duplicate-support-request';

describe('DuplicateSupportRequest', () => {
  let duplicateSupportRequest: DuplicateSupportRequest;
  let req: any;
  let res: any;

  beforeEach(() => {
    duplicateSupportRequest = new DuplicateSupportRequest();
    req = {
      session: {
        lastPage: undefined,
      },
      path: '/nsa/duplicate-support-request',
    };
    res = {
      render: jest.fn(),
    };
  });

  describe('get', () => {
    test('it should render the correct page', () => {
      duplicateSupportRequest.get(req, res);

      expect(res.render).toHaveBeenCalledWith('common/duplicate-support-request', {
        backLink: 'select-support-type',
      });
    });

    test('if the user came from the leaving nsa page, the back link should go to leaving nsa', () => {
      req.session.lastPage = 'nsa/leaving-nsa';

      duplicateSupportRequest.get(req, res);

      expect(res.render).toHaveBeenCalledWith('common/duplicate-support-request', {
        backLink: 'leaving-nsa',
      });
    });
  });
});
