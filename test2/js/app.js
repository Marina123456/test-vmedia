var app={
    /**
     * очередь запросов
     */
    queue: [],
    /**
     * статус запроса
     */
    active: false,
    /**
     * Функция для создания объекта
     * @param url
     * @param callbackFunc
     */
    addObject: function(url, callbackFunc) {
        var objData={
            url: url,
            callbackFunc: callbackFunc
        }
        app.queue.push(objData);
        app.conductQuery();
    },
    /**
     * Функция для управления очередью запросов
     */
    conductQuery: function() {
        if (app.active) return;

        app.active=true;

        if (app.queue.length==0) {
            app.active = false;
            return;
        }

        var current = app.queue.shift();

        $.ajax({
            dataType: "json",
            url: current.url,
            method: 'GET',
            success: function(jsonData){
                var obj=app.createObj(jsonData);
                current.callbackFunc(obj);
            },
            error: function (jqXHR, textStatus, errorThrown){
                app.error(textStatus, errorThrown);
            },
            complete: function(){
                app.active=false;
                if (app.queue.length!=0){
                    app.conductQuery();
                }
            }
        });
    },
    /**
     * Функция обработки ошибок
     * @param textStatus
     * @param errorThrown
     */
    error: function(textStatus, errorThrown) {
        app.log('Статус ошибки - '+textStatus+'; Текст ошибки - '+errorThrown);
    },
    /**
     * Функция создания объекта по json-данным
     * @param jsonConfig
     * @returns {*}
     */
    createObj: function(jsonConfig) {
        var htmlObj=document.createElement(jsonConfig.tag);
        htmlObj.innerHTML=jsonConfig.content;

        for (nameAtt in jsonConfig.attr) {
            htmlObj.setAttribute(nameAtt, jsonConfig.attr[nameAtt]);
        }

        for (cssName in jsonConfig.style) {
            $(htmlObj).css(cssName,jsonConfig.style[cssName]);
        }

        for (eventName in jsonConfig.events) {
            var func = new Function('', jsonConfig.events[eventName]);
            $(htmlObj).bind(eventName,func);
        }

        return htmlObj;
    },
    /**
     * Функция для вывода сообщений в консоль
     * @param obj
     */
    log: function(obj) {
        console.log(obj);
    }
}