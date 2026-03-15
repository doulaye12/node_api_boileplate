class ApiResponse {
  static success(res, data = null, message = 'Succès', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  static created(res, data = null, message = 'Ressource créée avec succès') {
    return this.success(res, data, message, 201);
  }

  static error(res, message = 'Une erreur est survenue', statusCode = 500) {
    return res.status(statusCode).json({
      status: 'error',
      message,
    });
  }

  static fail(res, message = 'Requête invalide', statusCode = 400) {
    return res.status(statusCode).json({
      status: 'fail',
      message,
    });
  }
}

module.exports = ApiResponse;
