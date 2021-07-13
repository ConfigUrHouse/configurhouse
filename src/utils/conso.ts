// Organise data to be used in consumption charts
export function getChartData(response: any) {
  const repartition = {
    labels: response.byPosteConso.config.map((item: any) => item.posteConso),
    datasets: [
      {
        label: '# of Consommation',
        data: response.byPosteConso.config.map((item: any) => item.conso),
        backgroundColor: ['#1a7c7d', '#a8cfcf', '#09444d', '#18b9ba'],
        borderWidth: 0,
      },
    ],
  };
  const repartitionRef = {
    labels: response.byPosteConso.reference.map(
      (item: any) => item.posteConso.name
    ),
    datasets: [
      {
        label: '# of Consommation',
        data: response.byPosteConso.reference.map((item: any) => item.conso),
        backgroundColor: ['#1a7c7d', '#a8cfcf', '#09444d', '#18b9ba'],
        borderWidth: 0,
      },
    ],
  };
  const postesConso = response.byPosteConso.reference.map(
    (item: any) => item.posteConso.name
  );
  const differences = {
    labels: ['Total'].concat(postesConso),
    datasets: [
      {
        categoryPercentage: 0.5,
        barPercentage: 1.0,
        label: 'Configuration',
        data: [response.global.config].concat(
          postesConso.map(
            (posteConso: string) =>
              response.byPosteConso.config.find(
                (item: any) => item.posteConso === posteConso
              )?.conso
          )
        ),
        backgroundColor: '#1a7c7d',
        borderWidth: 0,
        borderRadius: 5,
      },
      {
        categoryPercentage: 0.5,
        barPercentage: 1.0,
        label: 'Référence',
        data: [response.global.reference].concat(
          response.byPosteConso.reference.map((item: any) => item.conso)
        ),
        backgroundColor: '#a8cfcf',
        borderWidth: 0,
        borderRadius: 5,
      },
    ],
  };
  return {
    repartition,
    repartitionRef,
    differences,
  };
}
