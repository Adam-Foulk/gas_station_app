type StationType = {
  id: string;
  name: string;
  status: StationStatuses;
};

type FuelFormType = {
  quantity: number;
  sum: number;
  station: string;
};

type StationStatuses = 'enabled' | 'disabled' | 'occupied';
