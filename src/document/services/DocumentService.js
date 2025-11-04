import AsyncService from '../../networking/services/AsyncService';

class DocumentService {

  constructor(asyncService) {
    this.asyncService = asyncService;
  }

  loadByCategory(category) {
    return this.asyncService
      .loadData(`/${process.env.REACT_APP_API_PATH_DOCUMENTS}?category=${category}`).then(res => {
        return res.data.map(document =>
          new Document(
            document.id,
            document.title,
            document.description,
            document.preview_image_url,
            document.fileUrl
          )
        );
      });
  }
}

class Document {
  constructor(id, title, description, image, pdf) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.pdf = pdf;
  }
}

export default new DocumentService(AsyncService);
