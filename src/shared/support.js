import {
	
		
 	
		
 							// For Nested APIs / Join tables			
	 	
		
 	 							// For Nested APIs / Join tables			
	 							// For Nested APIs / Join tables			
	 							// For Nested APIs / Join tables			
	 	 	
		
 	
	
 	
		
   SetPetServiceSingle, SetPetOwnerSingle, SetPetOwnerPetsJoin, SetPetCareCenterSingle, SetPetCareCenterImagesJoin, SetPetCareCenterServicesJoin, SetPetCareCenterPetsJoin, SetManagerSingle, SetDocumentSingleMedia, SetPetSingle
} from "./services";
import Helper from "shared/helper";

var fn = {};

const defaultError = "Something went wrong while processing request!";

		
     
fn.AddOrUpdatePetService = async (input, enums, excludesItems) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
                    if (x.type === 'dropdown') {
                        data[x.key] = enums.find((z) => z.Name === x.source).Values.find((m) => parseInt(m[x.valueId]) === parseInt(x.value))[x.valueId];
                    } else {
                        data[x.key] = x.value;
                    }
                }
            });

        window.Busy(true);
        let rslt = await SetPetServiceSingle(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}
		
     
fn.AddOrUpdatePetOwner = async (input, excludesItems) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
                    data[x.key] = x.value;
                }
            });

        window.Busy(true);
        let rslt = await SetPetOwnerSingle(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}


  
fn.AddOrUpdatePetOwnerPets = async (PetId, OwnerId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        window.Busy(true);

        if (input.Deleted) {
            data = { Id: PetId, Deleted: input.Deleted };
            rslt = await SetPetOwnerPetsJoin(data);
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, PetId: input.PetId });
            }

            data = { PetId: input.PetId, Deleted: input.Deleted };

            rslt = await SetPetSingle(data);
	    
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, PetId: input.PetId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetPetSingle(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: PetId, PetId: id, OwnerId };
                rslt = await SetPetOwnerPetsJoin(data);
                if (!rslt.status) {
                    window.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    window.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            window.Busy(false);
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }
        window.Busy(false);

        return resolve({ status, id });
    });
}
		
     
fn.AddOrUpdatePetCareCenter = async (input, excludesItems) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
                    data[x.key] = x.value;
                }
            });

        window.Busy(true);
        let rslt = await SetPetCareCenterSingle(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}


  
fn.AddOrUpdatePetCareCenterImages = async (DocId, PcId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        window.Busy(true);

        if (input.Deleted) {
            data = { Id: DocId, Deleted: input.Deleted };
            rslt = await SetPetCareCenterImagesJoin(data);
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, DocId: input.DocId });
            }

            data = { DocId: input.DocId, Deleted: input.Deleted };

            rslt = await SetDocumentSingle(data);
	    
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, DocId: input.DocId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetDocumentSingle(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: DocId, DocId: id, PcId };
                rslt = await SetPetCareCenterImagesJoin(data);
                if (!rslt.status) {
                    window.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    window.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            window.Busy(false);
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }
        window.Busy(false);

        return resolve({ status, id });
    });
}


  
fn.AddOrUpdatePetCareCenterServices = async (ServiceId, PcId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        window.Busy(true);

        if (input.Deleted) {
            data = { Id: ServiceId, Deleted: input.Deleted };
            rslt = await SetPetCareCenterServicesJoin(data);
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, ServiceId: input.ServiceId });
            }

            data = { ServiceId: input.ServiceId, Deleted: input.Deleted };

            rslt = await SetPetServiceSingle(data);
	    
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, ServiceId: input.ServiceId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetPetServiceSingle(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: ServiceId, ServiceId: id, PcId };
                rslt = await SetPetCareCenterServicesJoin(data);
                if (!rslt.status) {
                    window.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    window.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            window.Busy(false);
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }
        window.Busy(false);

        return resolve({ status, id });
    });
}


  
fn.AddOrUpdatePetCareCenterPets = async (PetId, PcId, input) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, rslt, id = null;
        window.Busy(true);

        if (input.Deleted) {
            data = { Id: PetId, Deleted: input.Deleted };
            rslt = await SetPetCareCenterPetsJoin(data);
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, PetId: input.PetId });
            }

            data = { PetId: input.PetId, Deleted: input.Deleted };

            rslt = await SetPetSingle(data);
	    
            if (!rslt.status) {
                window.Busy(false);
                const msg = rslt.statusText || defaultError;
                window.AlertPopup("error", msg);
                return resolve({ status, PetId: input.PetId });
            }

            return resolve({ status: true });
        }

        const edited = input.Edited || false;

        delete input['Edited'];

        rslt = await SetPetSingle(input);
        if (rslt.status) {
            id = rslt.id;
            status = true;
            if (!Helper.IsNullValue(id) && !edited) {
                data = { Id: PetId, PetId: id, PcId };
                rslt = await SetPetCareCenterPetsJoin(data);
                if (!rslt.status) {
                    window.Busy(false);
                    const msg = rslt.statusText || defaultError;
                    window.AlertPopup("error", msg);
                    return resolve({ status, id });
                }
            }
        } else {
            window.Busy(false);
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }
        window.Busy(false);

        return resolve({ status, id });
    });
}
		
     
fn.AddOrUpdateManager = async (input, excludesItems) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
                    data[x.key] = x.value;
                }
            });

        window.Busy(true);
        let rslt = await SetManagerSingle(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}
		

fn.AddOrUpdateDocument = async (input) => {
    return new Promise(async (resolve) => {
        let status = false, id = null;
        const { 
        DocId,
        DocName,
        FileName,
        FileType,
        FileDescription
        , DocData
        } = input.value;
        window.Busy(true);
        let rslt = await SetDocumentSingleMedia(DocData, { 
        DocName,
        FileName,
        FileType,
        FileDescription
        , DocId: DocId });
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
};

		
     
fn.AddOrUpdatePet = async (input, excludesItems) => {
    return new Promise(async (resolve) => {
        let data = {}, status = false, id = null;
        let excludes = excludesItems || [];
        Object.values(input)
            .filter((x) => x.value)
            .map((x) => {
                if (excludes.indexOf(x.key) === -1) {
                    data[x.key] = x.value;
                }
            });

        window.Busy(true);
        let rslt = await SetPetSingle(data);
        window.Busy(false);
        if (rslt.status) {
            id = rslt.id;
            status = true;
        } else {
            const msg = rslt.statusText || defaultError;
            window.AlertPopup("error", msg);
        }

        return resolve({ status, id });
    });
}




export default fn;
