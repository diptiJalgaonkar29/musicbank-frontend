import axiosRelativeBlob from '../../common/utils/axios-relative-blob';

export const fetchPreviewImage = imgUrl => {
  return new Promise((resolve, reject) => {
    axiosRelativeBlob
      .get(
				`/files/${process.env.REACT_APP_API_PATH_PICTURES}/${imgUrl}`,
				{
				  headers: {
				    Authorization: `Bearer ${localStorage.getItem('token')}`
				  }
				}
      )
      .then(res => {
        const blob = URL.createObjectURL(res.data);
        resolve(blob);
      })
      .catch(err => reject(err));
  });
};

export const fetchWaveform = imgUrl => {
  return new Promise((resolve, reject) => {
    axiosRelativeBlob
      .get(
				`/files/${process.env.REACT_APP_API_PATH_WAVEFORMS}/${imgUrl}`,
				{
				  headers: {
				    Authorization: `Bearer ${localStorage.getItem('token')}`
				  }
				}
      )
      .then(res => {
        const blob = URL.createObjectURL(res.data);
        resolve(blob);
      })
      .catch(err => reject(err));
  });
};
